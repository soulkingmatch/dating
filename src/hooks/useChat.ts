import { useState, useEffect } from 'react';
import { getMessages, sendMessage, markAsRead, subscribeToMessages } from '../services/messageService';
import type { Message } from '../types/chat';

export function useChat(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      try {
        setLoading(true);
        const data = await getMessages(matchId);
        if (mounted) {
          setMessages(data);
          await markAsRead(matchId);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load messages');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMessages();

    // Subscribe to new messages
    const subscription = subscribeToMessages(matchId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      markAsRead(matchId);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [matchId]);

  const send = async (content: string) => {
    try {
      const newMessage = await sendMessage(matchId, content);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  return { messages, loading, error, send };
}