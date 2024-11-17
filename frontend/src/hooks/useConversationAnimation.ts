import { useState, useEffect, useCallback } from 'react'

type Message = {
  text: string
  lang: string
  speaker: 'user' | 'bot'
}

type Conversation = {
  user1: Message
  bot1: Message
  user2: Message
  bot2: Message
}

const conversations: Conversation[] = [
  {
    user1: { text: "Hi, I'd like to book a room", lang: "English", speaker: 'user' },
    bot1: { text: "I'll help you with that. What dates are you looking for?", lang: "English", speaker: 'bot' },
    user2: { text: "Prefiero continuar en español, del 15 al 20 de marzo", lang: "Spanish", speaker: 'user' },
    bot2: { text: "Perfecto. Tenemos habitaciones disponibles para esas fechas. ¿Qué tipo de habitación prefiere?", lang: "Spanish", speaker: 'bot' }
  },
  {
    user1: { text: "Bonjour, je voudrais réserver une chambre", lang: "French", speaker: 'user' },
    bot1: { text: "Je peux vous aider avec ça. Pour quelles dates?", lang: "French", speaker: 'bot' },
    user2: { text: "日本語で続けてもいいですか？来週の木曜日からです", lang: "Japanese", speaker: 'user' },
    bot2: { text: "かしこまりました。何泊のご予定でしょうか？", lang: "Japanese", speaker: 'bot' }
  },
  {
    user1: { text: "Guten Tag, ich möchte ein Zimmer buchen", lang: "German", speaker: 'user' },
    bot1: { text: "Ich helfe Ihnen gerne. Für welches Datum?", lang: "German", speaker: 'bot' },
    user2: { text: "我想用中文继续，下周二入住", lang: "Chinese", speaker: 'user' },
    bot2: { text: "好的，请问您想预订什么类型的房间？", lang: "Chinese", speaker: 'bot' }
  },
  {
    user1: { text: "مرحباً، أود حجز غرفة", lang: "Arabic", speaker: 'user' },
    bot1: { text: "سأساعدك في ذلك. ما هي التواريخ التي تبحث عنها؟", lang: "Arabic", speaker: 'bot' },
    user2: { text: "I'd prefer to continue in English, from July 15th", lang: "English", speaker: 'user' },
    bot2: { text: "Of course! How many nights would you like to stay?", lang: "English", speaker: 'bot' }
  }
]

const MESSAGE_TIMING = {
  initial: 0,
  response: 1000,
  languageSwitch: 2000,
  finalResponse: 3000
}

export function useConversationAnimation() {
  const [currentConversation, setCurrentConversation] = useState(conversations[0])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleMessages, setVisibleMessages] = useState<(Message & { key: string })[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const addMessage = useCallback((message: Message, index: number) => {
    setVisibleMessages(prev => [...prev, { ...message, key: `${currentIndex}-${index}` }])
  }, [currentIndex])

  const startNewConversation = useCallback(() => {
    setIsTransitioning(true)
    setVisibleMessages([])
    
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % conversations.length
      setCurrentIndex(nextIndex)
      setCurrentConversation(conversations[nextIndex])
      setIsTransitioning(false)
      
      // Start showing messages with delays
      const messages = [
        conversations[nextIndex].user1,
        conversations[nextIndex].bot1,
        conversations[nextIndex].user2,
        conversations[nextIndex].bot2
      ]
      
      messages.forEach((message, i) => {
        setTimeout(() => addMessage(message, i), i * 1000)
      })
    }, 300)
  }, [currentIndex, addMessage])

  useEffect(() => {
    const messages = [
      currentConversation.user1,
      currentConversation.bot1,
      currentConversation.user2,
      currentConversation.bot2
    ]
    
    messages.forEach((message, i) => {
      const timing = i === 0 ? MESSAGE_TIMING.initial :
                    i === 1 ? MESSAGE_TIMING.response :
                    i === 2 ? MESSAGE_TIMING.languageSwitch :
                    MESSAGE_TIMING.finalResponse
      setTimeout(() => addMessage(message, i), timing)
    })

    const interval = setInterval(startNewConversation, 15000)
    return () => clearInterval(interval)
  }, [])

  return { visibleMessages, isTransitioning }
} 