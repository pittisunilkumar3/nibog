/**
 * FAQ Service for NIBOG Platform
 * Handles all FAQ-related API interactions
 */

import { FAQ_API } from '@/config/api';

export interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: string;
  display_priority?: number;
  display_order?: number;
  status?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FAQsByCategory {
  [category: string]: FAQ[];
}

/**
 * Fetch all active FAQs from the API
 */
export async function getAllActiveFAQs(): Promise<FAQ[]> {
  try {
    console.log('📋 Fetching all active FAQs from API...');
    
    const response = await fetch(FAQ_API.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📋 FAQ API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.status}`);
    }

    const data = await response.json();
    console.log('📋 FAQ API response:', data);

    // Handle different response formats
    let faqs: FAQ[] = [];
    
    if (Array.isArray(data)) {
      faqs = data;
    } else if (data.data && Array.isArray(data.data)) {
      faqs = data.data;
    } else if (data.faqs && Array.isArray(data.faqs)) {
      faqs = data.faqs;
    } else {
      console.warn('📋 Unexpected API response format:', data);
      faqs = [];
    }

    // Filter only active FAQs and sort by display_order
    const activeFAQs = faqs
      .filter(faq => faq.is_active !== false) // Include if is_active is true or undefined
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    console.log(`✅ Fetched ${activeFAQs.length} active FAQs`);
    
    return activeFAQs;
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    throw error;
  }
}

/**
 * Fetch all FAQs (including inactive) - for admin use
 */
export async function getAllFAQs(): Promise<FAQ[]> {
  try {
    console.log('📋 Fetching all FAQs from API (admin)...');
    
    const response = await fetch(FAQ_API.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📋 FAQ GET_ALL API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.status}`);
    }

    const data = await response.json();
    console.log('📋 FAQ GET_ALL API response:', data);

    // API returns array directly
    if (Array.isArray(data)) {
      const sortedFaqs = data.sort((a: FAQ, b: FAQ) => (a.display_priority || a.display_order || 0) - (b.display_priority || b.display_order || 0));
      console.log(`✅ Fetched ${sortedFaqs.length} FAQs (admin)`);
      return sortedFaqs;
    } else if (data.data && Array.isArray(data.data)) {
      const sortedFaqs = data.data.sort((a: FAQ, b: FAQ) => (a.display_priority || a.display_order || 0) - (b.display_priority || b.display_order || 0));
      console.log(`✅ Fetched ${sortedFaqs.length} FAQs (admin)`);
      return sortedFaqs;
    } else if (data.faqs && Array.isArray(data.faqs)) {
      const sortedFaqs = data.faqs.sort((a: FAQ, b: FAQ) => (a.display_priority || a.display_order || 0) - (b.display_priority || b.display_order || 0));
      console.log(`✅ Fetched ${sortedFaqs.length} FAQs (admin)`);
      return sortedFaqs;
    }

    console.warn('⚠️ Unexpected API response format:', data);
    return [];
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    throw error;
  }
}

/**
 * Group FAQs by category
 */
export function groupFAQsByCategory(faqs: FAQ[]): FAQsByCategory {
  const grouped: FAQsByCategory = {};

  faqs.forEach(faq => {
    const category = faq.category || 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(faq);
  });

  // Sort FAQs within each category by display_order
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  });

  return grouped;
}

/**
 * Get FAQs by specific category
 */
export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  try {
    const allFAQs = await getAllActiveFAQs();
    return allFAQs.filter(faq => 
      faq.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching FAQs for category ${category}:`, error);
    throw error;
  }
}

/**
 * Create a new FAQ
 */
export async function createFAQ(faqData: {
  question: string;
  answer: string;
  category: string;
  display_priority: number;
  status: string;
}): Promise<FAQ> {
  try {
    console.log('📝 Creating FAQ with data:', faqData);
    
    const response = await fetch(FAQ_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(faqData),
    });

    console.log('📝 FAQ Create API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FAQ Create API error:', errorText);
      throw new Error(`Failed to create FAQ: ${response.status}`);
    }

    const data = await response.json();
    console.log('📝 FAQ Create API response:', data);

    // API returns array with the created FAQ as first element
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    // Fallback to other response formats
    return data.data || data.faq || data;
  } catch (error) {
    console.error('❌ Error creating FAQ:', error);
    throw error;
  }
}

/**
 * Update an existing FAQ
 */
export async function updateFAQ(id: number, faqData: Partial<FAQ>): Promise<FAQ> {
  try {
    const response = await fetch(FAQ_API.UPDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...faqData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update FAQ: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data.faq || data;
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
}

/**
 * Delete a FAQ
 */
export async function deleteFAQ(id: number): Promise<void> {
  try {
    const response = await fetch(FAQ_API.DELETE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete FAQ: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
}
