import Link from "next/link"
import { Facebook, Twitter, Instagram, GitlabIcon as GitHub, Mail, Send, SnailIcon as Snapchat } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-6 backdrop-blur-md bg-purple-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Column 1: Company Info */}
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                EsimCity
              </span>
            </Link>
            <p className="text-sm text-gray-300 mt-1 mb-4">Secure SMS verification services</p>
          </div>

          {/* Column 2: Quick Links - Now vertical with larger font */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/services" className="text-base text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/countries" className="text-base text-gray-300 hover:text-white">
                  Countries
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-base text-gray-300 hover:text-white">
                  Payment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-base text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-gray-300 hover:text-white">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-4">Stay Updated</h3>
            <p className="text-base text-gray-300 mb-3">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex w-full max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm bg-purple-900/50 border border-purple-500/50 rounded-l-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-r-md hover:from-purple-700 hover:to-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods - Centered with larger buttons */}
        <div className="mt-8 flex flex-col items-center">
          <h4 className="text-lg font-medium text-white mb-4">Payment Methods</h4>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">PayPal</span>
            </div>
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">Stripe</span>
            </div>
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-xs font-bold text-green-600">M-Pesa</span>
            </div>
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-500">Binance</span>
            </div>
            {/* BTC symbol for Cryptomus */}
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-xs font-bold text-orange-500">₿</span>
            </div>
            {/* Credit card for Checkout.com */}
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Social Icons - With added Telegram, Snapchat, and Mail */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="#" className="text-gray-300 hover:text-white">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <GitHub className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <Send className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <Snapchat className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <Mail className="h-6 w-6" />
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-300">© {new Date().getFullYear()} EsimCity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
