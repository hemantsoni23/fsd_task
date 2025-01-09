import React from 'react'

const MessageModal = ({text, button1_text, button2_text, onClose, handleAction}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className=" rounded-lg p-6 w-full max-w-md bg-background text-text">
              <h3 className="text-xl font-bold mb-4">{text}</h3>
              <div className="flex justify-center space-x-4">
                {button1_text && <button
                    className="px-4 py-2 rounded-md bg-secondary hover:bg-hover text-text"
                    onClick={onClose}
                >
                      { button1_text}
                </button>}
                <button
                    className="px-4 py-2 rounded-md bg-primary hover:bg-hover text-white"
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