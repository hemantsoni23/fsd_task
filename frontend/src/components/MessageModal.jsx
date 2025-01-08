import React from 'react'

const MessageModal = ({text, button1_text, button2_text, onClose, handleAction}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <h3 className="text-text text-xl font-bold mb-4">{text}</h3>
              <div className="flex justify-center space-x-4">
                {button1_text && <button
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={onClose}
                >
                      { button1_text}
                </button>}
                <button
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                    onClick={handleAction}
                >
                      { button2_text}
                </button>
              </div>
        </div>      
    </div>
  )
}

export default MessageModal