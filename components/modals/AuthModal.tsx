'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

import useAuthModal from '@/hooks/useAuthModal';
import Modal from './Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AuthModal = () => {
  const authModal = useAuthModal();
  const [variant, setVariant] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    
    if (variant === 'REGISTER') {
      try {
        await axios.post('/api/register', { email, name, password });
        setVariant('LOGIN'); // Switch to login view
      } catch (error) { 
        console.error('Something went wrong during registration.'); 
      } finally {
        setIsLoading(false);
      }
    }
    
    if (variant === 'LOGIN') {
      try {
        const result = await signIn('credentials', { redirect: false, email, password });
        if (result?.error) { 
          console.error('Invalid credentials. Please try again.'); 
        } else {
          authModal.onClose();
        }
      } catch (error) {
        console.error('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Body Content with the "Continue" button
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">
        {variant === 'LOGIN' ? 'Log in or sign up' : 'Finish signing up'}
      </div>
      <hr />
      <div className="font-semibold text-xl text-gray-700">
        Welcome to RealEstate
      </div>
      
      {variant === 'REGISTER' && (
        <Input id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
      )}
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
      <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />

      {/* ACTION BUTTON IS NOW HERE */}
      <div className="pt-4">
        <Button 
          label={isLoading ? "Loading..." : "Continue"} 
          onClick={onSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );

  // Footer Content for social logins and toggling variant
  const footerContent = (
    <>
      <div className="flex items-center w-full gap-2 my-2">
        <div className="w-full h-px bg-neutral-200" />
        <div className="text-neutral-500 text-sm">or</div>
        <div className="w-full h-px bg-neutral-200" />
      </div>
      <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => signIn('google')} />
      
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>{variant === 'LOGIN' ? 'First time using RealEstate?' : 'Already have an account?'}</div>
          <div onClick={toggleVariant} className="text-neutral-800 cursor-pointer hover:underline">
            {variant === 'LOGIN' ? 'Create an account' : 'Log in'}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={authModal.isOpen}
      onClose={authModal.onClose}
      title={variant === 'LOGIN' ? 'Log in or sign up' : 'Sign up'}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default AuthModal;