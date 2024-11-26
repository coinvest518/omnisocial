// services/userService.ts
import { getSession } from 'next-auth/react';
import { Template } from '../constants/templates';

export async function getUserData() {
  const session = await getSession();
  if (!session || !session.user.id) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return await response.json();
}

export async function getRecentTemplates(): Promise<Template[]> {
  const session = await getSession();
  if (!session || !session.user.id) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/recentTemplates');
  if (!response.ok) {
    throw new Error('Failed to fetch recent templates');
  }

  return await response.json();
}

export async function logTemplateUsage(templateId: string, content: any) {
  const session = await getSession();

  console.log('Session in logTemplateUsage:', session);

  if (!session || !session.user.id) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/logrecentTemplates', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ templateId, content }),
  });

  if (!response.ok) {
    const errorData = await response.json(); // Capture error response for debugging
    console.error('Error logging template usage:', errorData);
    throw new Error('Failed to log template usage');
  }
}
export async function getUserCredits(): Promise<number> {
  const session = await getSession();
  if (!session || !session.user.id) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch('/api/credits', {
      credentials: 'include', // Important for server-side requests
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user credits');
    }

    const data = await response.json();
    return data.credits; // Ensure this matches the structure returned by your API
  } catch (error) {
    console.error('Error fetching user credits:', error);
    throw error; // Re-throw to handle at a higher level if needed
  }
}