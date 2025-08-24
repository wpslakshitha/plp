'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, body, footer }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} /* ... backdrop transition ... */ >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
           <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} /* ... panel transition ... */ >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center p-6 border-b-[1px] relative justify-center">
                  <button onClick={onClose} className="p-1 border-0 hover:opacity-70 transition absolute left-9">
                    <IoMdClose size={18} />
                  </button>
                  <div className="text-lg font-semibold">{title}</div>
                </div>
                {/* Body */}
                <div className="relative p-6 flex-auto">{body}</div>
                {/* Footer */}
                {footer && <div className="flex flex-col gap-2 p-6">{footer}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;