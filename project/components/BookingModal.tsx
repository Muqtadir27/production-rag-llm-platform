'use client'

import { useState, useEffect, useRef } from 'react'
import { X, User, Briefcase, HelpCircle, ChevronDown } from 'lucide-react'

interface BookingModalProps {
  onClose: () => void
}

type UserType = 'founder' | 'hr' | 'other' | null
type InquiryType = string | null

const userTypeOptions = [
  { value: 'founder', label: 'Founder', icon: User },
  { value: 'hr', label: 'HR/Company representative', icon: Briefcase },
  { value: 'other', label: 'Other', icon: HelpCircle },
]

const inquiryOptions: Record<string, Array<{ value: string; label: string }>> = {
  founder: [
    { value: 'job', label: 'Want to hire you for a job/Job offer' },
    { value: 'freelance', label: 'Have some freelancing work' },
    { value: 'none', label: 'None' },
  ],
  hr: [
    { value: 'job', label: 'Want to hire you for a job/Job offer' },
    { value: 'freelance', label: 'Have some freelancing work' },
    { value: 'none', label: 'None' },
  ],
  other: [
    { value: 'guidance', label: 'Want to get some guidance' },
    { value: 'query', label: 'Want to resolve a query' },
    { value: 'others', label: 'Others' },
  ],
}

export default function BookingModal({ onClose }: BookingModalProps) {
  const [userType, setUserType] = useState<UserType>(null)
  const [inquiryType, setInquiryType] = useState<InquiryType>(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showInquiryDropdown, setShowInquiryDropdown] = useState(false)

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setShowUserDropdown(false)
    setInquiryType(null) // Reset inquiry when user type changes
  }

  const handleInquirySelect = (inquiry: string) => {
    setInquiryType(inquiry)
    setShowInquiryDropdown(false)
  }

  const userDropdownRef = useRef<HTMLDivElement>(null)
  const inquiryDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target) &&
        inquiryDropdownRef.current &&
        !inquiryDropdownRef.current.contains(target)
      ) {
        setShowUserDropdown(false)
        setShowInquiryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProceed = () => {
    if (userType && inquiryType) {
      // Handle form submission
      console.log('User Type:', userType)
      console.log('Inquiry Type:', inquiryType)
      // Here you would typically send this data to your backend
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-neuro-dark border border-white/20 rounded-xl p-8 max-w-md w-full glass-effect">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Book Call Inquiry</h2>

        <div className="space-y-6">
          {/* First Dropdown */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              ARE YOU A?
            </label>
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white flex items-center justify-between hover:border-white/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {userType ? (
                    <>
                      {(() => {
                        const option = userTypeOptions.find((opt) => opt.value === userType)
                        const Icon = option?.icon || User
                        return (
                          <>
                            <Icon className="w-5 h-5" />
                            <span>{option?.label}</span>
                          </>
                        )
                      })()}
                    </>
                  ) : (
                    <span className="text-white/50">Select an option</span>
                  )}
                </div>
                <ChevronDown className="w-5 h-5 text-white/50" />
              </button>

              {showUserDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-neuro-dark border border-white/20 rounded-lg overflow-hidden glass-effect">
                  {userTypeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleUserTypeSelect(option.value as UserType)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center space-x-3 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Second Dropdown */}
          {userType && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                WHAT'S YOUR INQUIRY ABOUT?
              </label>
              <div className="relative" ref={inquiryDropdownRef}>
                <button
                  onClick={() => setShowInquiryDropdown(!showInquiryDropdown)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white flex items-center justify-between hover:border-white/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {inquiryType ? (
                      <>
                        <Briefcase className="w-5 h-5" />
                        <span>
                          {inquiryOptions[userType]?.find((opt) => opt.value === inquiryType)
                            ?.label || inquiryType}
                        </span>
                      </>
                    ) : (
                      <span className="text-white/50">Select an option</span>
                    )}
                  </div>
                  <ChevronDown className="w-5 h-5 text-white/50" />
                </button>

                {showInquiryDropdown && inquiryOptions[userType] && (
                  <div className="absolute z-10 w-full mt-2 bg-neuro-dark border border-white/20 rounded-lg overflow-hidden glass-effect">
                    {inquiryOptions[userType].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInquirySelect(option.value)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center space-x-3 transition-colors"
                      >
                        <Briefcase className="w-5 h-5" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!userType || !inquiryType}
            className="w-full px-6 py-4 bg-white text-neuro-dark font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>Proceed to Calendar</span>
            <span>&gt;</span>
          </button>
        </div>
      </div>

    </div>
  )
}
