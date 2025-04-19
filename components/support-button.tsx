"use client"

import { useState } from "react"
import { Headset, MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supportContacts } from "@/lib/default-data"

export function SupportButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-purple-900/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-2 border border-purple-500/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white">Contact Support</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-purple-200 hover:text-white hover:bg-purple-800/50"
              onClick={toggleOpen}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col space-y-4">
            <a
              href={`tel:${supportContacts.phone}`}
              className="flex items-center p-2 hover:bg-purple-800/50 rounded-md transition-colors text-purple-200 hover:text-white"
              title="Call Support"
            >
              <Headset className="h-6 w-6 text-purple-300 mr-3" />
              <span className="text-sm">Call Support</span>
            </a>

            <a
              href={`https://wa.me/${supportContacts.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 hover:bg-purple-800/50 rounded-md transition-colors text-purple-200 hover:text-white"
              title="WhatsApp Support"
            >
              <MessageCircle className="h-6 w-6 text-green-400 mr-3" />
              <span className="text-sm">WhatsApp</span>
            </a>

            <a
              href={`https://t.me/${supportContacts.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 hover:bg-purple-800/50 rounded-md transition-colors text-purple-200 hover:text-white"
              title="Telegram Support"
            >
              <Send className="h-6 w-6 text-blue-400 mr-3" />
              <span className="text-sm">Telegram</span>
            </a>
          </div>
        </div>
      )}

      <Button
        onClick={toggleOpen}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-red-500 hover:from-purple-700 hover:via-blue-700 hover:to-red-600 shadow-lg flex items-center justify-center"
      >
        <Headset className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
