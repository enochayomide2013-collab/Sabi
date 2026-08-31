import { RecipeItem } from '../types';

export interface ClaimExtractionResult {
  extractedClaim: string;
  category: 'market_price' | 'rumor' | 'outdated_media' | 'local_event' | 'food_recipe';
  detectedLocation?: {
    state?: string;
    lga?: string;
    area?: string;
  };
  confidence: number;
  duplicateFound: boolean;
  duplicateInfo?: {
    existingTaskId: string;
    existingClaim: string;
    status: string;
  };
  outdatedIndicators?: {
    isOutdatedLikely: boolean;
    reason?: string;
    firstSeenApprox?: string;
  };
}

export interface FoodRecognitionResult {
  detectedItemName: string;
  category: 'Vegetables' | 'Grains' | 'Tubers' | 'Oils & Spices' | 'Proteins' | 'Essentials';
  confidenceScore: number;
  marketMatchId?: string;
  detectedIngredients: string[];
}

export class AiService {
  /**
   * Simulates AI Claim Extraction using OCR, audio transcription & visual analysis
   */
  public static async analyzeEvidence(
    fileName: string,
    fileType: string,
    rawTextPrompt?: string
  ): Promise<ClaimExtractionResult> {
    // Artificial delay for realistic progress
    await new Promise(resolve => setTimeout(resolve, 1400));

    const lowerName = (fileName + ' ' + (rawTextPrompt || '')).toLowerCase();

    // Outdated media check patterns
    if (lowerName.includes('fuel') || lowerName.includes('scarcity') || lowerName.includes('queue') || lowerName.includes('petrol')) {
      return {
        extractedClaim: 'Fuel scarcity rumor and pump price spike to ₦1,400/L at local stations',
        category: 'rumor',
        detectedLocation: {
          state: 'Lagos',
          lga: 'Lagos Mainland',
          area: 'Yaba'
        },
        confidence: 96,
        duplicateFound: false,
        outdatedIndicators: {
          isOutdatedLikely: true,
          reason: 'Visual billboards and vehicle license plates match historical footage archive from May 2024.',
          firstSeenApprox: 'May 2024'
        }
      };
    }

    if (lowerName.includes('rice') || lowerName.includes('90') || lowerName.includes('dei') || lowerName.includes('grain')) {
      return {
        extractedClaim: 'Foreign parboiled rice 50kg bag price crash to ₦90,000 in Dei-Dei Market',
        category: 'market_price',
        detectedLocation: {
          state: 'FCT - Abuja',
          lga: 'Bwari',
          area: 'Dei-Dei Building & Food Market'
        },
        confidence: 94,
        duplicateFound: true,
        duplicateInfo: {
          existingTaskId: 'task_001',
          existingClaim: 'Is a 50kg bag of foreign rice really selling for ₦90,000 in Dei-Dei Market?',
          status: 'Under Active Community Verification (2/3 completed)'
        }
      };
    }

    if (lowerName.includes('tomato') || lowerName.includes('bodija') || lowerName.includes('basket')) {
      return {
        extractedClaim: 'Fresh tomato basket price dropped to ₦25,000 due to high supply arrivals',
        category: 'market_price',
        detectedLocation: {
          state: 'Oyo',
          lga: 'Ibadan North',
          area: 'Bodija International Market'
        },
        confidence: 91,
        duplicateFound: false
      };
    }

    if (lowerName.includes('bridge') || lowerName.includes('onitsha') || lowerName.includes('closed') || lowerName.includes('traffic')) {
      return {
        extractedClaim: 'River Niger Bridge closed for emergency repairs and traffic disruption',
        category: 'local_event',
        detectedLocation: {
          state: 'Anambra',
          lga: 'Onitsha South',
          area: 'Bridgehead Market'
        },
        confidence: 97,
        duplicateFound: false
      };
    }

    if (lowerName.includes('cement') || lowerName.includes('5200') || lowerName.includes('dangote')) {
      return {
        extractedClaim: 'Claim that 50kg bag of cement price reduced to ₦5,200 factory direct',
        category: 'market_price',
        detectedLocation: {
          state: 'Rivers',
          lga: 'Port Harcourt City',
          area: 'Mile 1 Market'
        },
        confidence: 92,
        duplicateFound: false
      };
    }

    // Default intelligent extraction
    const claimHeadline = rawTextPrompt && rawTextPrompt.length > 5 
      ? rawTextPrompt 
      : `Verification request for reported incident in ${fileName.replace(/[_-]/g, ' ').replace(/\.[^/.]+$/, "")}`;

    return {
      extractedClaim: claimHeadline,
      category: 'rumor',
      detectedLocation: {
        state: 'Lagos',
        lga: 'Lagos Mainland',
        area: 'Yaba'
      },
      confidence: 88,
      duplicateFound: false
    };
  }

  /**
   * Recognizes food items from camera photo or gallery upload
   */
  public static async recognizeFoodItem(fileName: string): Promise<FoodRecognitionResult> {
    await new Promise(resolve => setTimeout(resolve, 1100));
    const lower = fileName.toLowerCase();

    if (lower.includes('yam') || lower.includes('tuber')) {
      return {
        detectedItemName: 'Tubers of Yam',
        category: 'Tubers',
        confidenceScore: 94,
        marketMatchId: 'mkt_yam',
        detectedIngredients: ['Yam (Fresh Tubers)', 'Eggs', 'Onions', 'Fresh Pepper', 'Vegetable Oil']
      };
    }

    if (lower.includes('rice') || lower.includes('grain')) {
      return {
        detectedItemName: 'Parboiled Rice',
        category: 'Grains',
        confidenceScore: 96,
        marketMatchId: 'mkt_rice',
        detectedIngredients: ['Long Grain Rice', 'Fresh Tomatoes', 'Tatashe Bell Peppers', 'Scotch Bonnet', 'Onions', 'Chicken Stock']
      };
    }

    if (lower.includes('garri') || lower.includes('cassava')) {
      return {
        detectedItemName: 'White / Yellow Garri',
        category: 'Tubers',
        confidenceScore: 91,
        marketMatchId: 'mkt_garri',
        detectedIngredients: ['Garri (Ijebu / Delta)', 'Groundnuts', 'Water', 'Vegetable Soup']
      };
    }

    if (lower.includes('oil') || lower.includes('palm')) {
      return {
        detectedItemName: 'Red Palm Oil',
        category: 'Oils & Spices',
        confidenceScore: 95,
        marketMatchId: 'mkt_palmoil',
        detectedIngredients: ['Palm Oil', 'Locust Beans (Iru)', 'Smoked Catfish', 'Spinach (Efo)', 'Crayfish']
      };
    }

    // Default to Fresh Tomatoes
    return {
      detectedItemName: 'Fresh Tomatoes',
      category: 'Vegetables',
      confidenceScore: 89,
      marketMatchId: 'mkt_tomato',
      detectedIngredients: ['Fresh Tomatoes', 'Scotch Bonnet (Atarodo)', 'Onions', 'Eggs', 'Vegetable Oil']
    };
  }

  /**
   * Generates a realistic Nigerian 3-step recipe from detected ingredients
   */
  public static async generateRecipeFromIngredients(ingredients: string[]): Promise<RecipeItem> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const ingString = ingredients.join(' ').toLowerCase();

    if (ingString.includes('yam')) {
      return {
        id: 'rec_gen_' + Date.now(),
        title: 'Savory Boiled Yam & Peppered Egg Sauce',
        description: 'Tender boiled yam wedges matched with sweet, caramelized onion and spicy tomato egg scramble.',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 2,
        difficulty: 'Easy',
        originRegion: 'Nationwide Classic',
        caloriesApprox: 430,
        videoDurationSec: 20,
        videoThumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        ingredients: ingredients.length > 0 ? ingredients : ['Yam (3-4 round slices)', 'Eggs (3)', 'Tomatoes (3)', 'Onions', 'Pepper', 'Oil'],
        steps: [
          {
            stepNumber: 1,
            title: 'Peel, Wash, and Boil Yam',
            instruction: 'Peel yam and cut into even slices. Boil in lightly salted water for 12 minutes until fork-tender.',
            durationSec: 5,
            imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
            tips: 'A pinch of sugar enhances natural yam sweetness.'
          },
          {
            stepNumber: 2,
            title: 'Sauté Tomato, Onion, and Pepper Base',
            instruction: 'Heat 2 tbsp oil in a pan. Sauté chopped onions and tomatoes until sweet and reduced.',
            durationSec: 7,
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
            tips: 'Fry gently so onions turn golden and aromatic.'
          },
          {
            stepNumber: 3,
            title: 'Pour Whisked Eggs and Scramble',
            instruction: 'Whisk eggs with seasoning. Pour into sauce, allow to set 20 seconds, fold softly and serve with warm yam.',
            durationSec: 8,
            imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
            tips: 'Do not overcook eggs to retain moisture.'
          }
        ]
      };
    }

    if (ingString.includes('rice')) {
      return {
        id: 'rec_gen_' + Date.now(),
        title: 'Quick Tomato-Pepper Braised Rice',
        description: 'Savory parboiled rice infused with fresh tomato-pepper stew and sweet onions.',
        prepTimeMinutes: 15,
        cookTimeMinutes: 25,
        servings: 4,
        difficulty: 'Easy',
        originRegion: 'Quick Comfort',
        caloriesApprox: 480,
        videoDurationSec: 20,
        videoThumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
        ingredients: ingredients,
        steps: [
          {
            stepNumber: 1,
            title: 'Blend and Parboil',
            instruction: 'Coarsely blend tomatoes, peppers, and onions. Parboil long grain rice and drain.',
            durationSec: 5,
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
          },
          {
            stepNumber: 2,
            title: 'Fry Aromatic Sauce',
            instruction: 'Fry the pepper blend in vegetable oil with seasoning cube and curry powder until fragrant.',
            durationSec: 7,
            imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
          },
          {
            stepNumber: 3,
            title: 'Simmer on Low Steam',
            instruction: 'Stir rice into seasoned stew base. Cover tightly and cook on low heat for 20 minutes.',
            durationSec: 8,
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
          }
        ]
      };
    }

    // Default Spinach & Tomato Stir-Fry
    return {
      id: 'rec_gen_' + Date.now(),
      title: 'Fresh Garden Pepper & Tomato Medley',
      description: 'A vibrant Nigerian quick sauce packed with fresh vegetables, onions, and rich seasoning.',
      prepTimeMinutes: 8,
      cookTimeMinutes: 10,
      servings: 2,
      difficulty: 'Easy',
      originRegion: 'Quick Comfort',
      caloriesApprox: 260,
      videoDurationSec: 20,
      videoThumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      ingredients: ingredients,
      steps: [
        {
          stepNumber: 1,
          title: 'Dice Fresh Ingredients',
          instruction: 'Finely slice tomatoes, onions, and peppers.',
          durationSec: 5,
          imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
        },
        {
          stepNumber: 2,
          title: 'Sauté in Warm Oil',
          instruction: 'Sauté onions and peppers on medium heat with seasoning for 4 minutes.',
          durationSec: 7,
          imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
        },
        {
          stepNumber: 3,
          title: 'Simmer and Serve',
          instruction: 'Add tomatoes and cook until soft. Serve with rice, bread, or boiled plantains.',
          durationSec: 8,
          imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80'
        }
      ]
    };
  }
}
