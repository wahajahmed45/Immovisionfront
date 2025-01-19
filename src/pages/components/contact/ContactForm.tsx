import { useState, useEffect } from 'react';
import { sendMessage } from '@/services/Message/MessageServices';
import { getUserEmail } from '@/stores/auth/auth';
import { getUserInfo } from '@/services/user/UserServices';

interface ContactFormProps {
  agentEmail: string | null;
  propertyId: string;
}

export const ContactForm = ({ agentEmail, propertyId }: ContactFormProps) => {
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const userEmail = getUserEmail();
    if (userEmail) {
      getUserInfo(userEmail).then(userInfo => {
        setFormData({
          name: userInfo.name,
          email: userEmail
        });
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!agentEmail) {
      setFormError('No agent associated with this property');
      return;
    }
    
    try {
      const formData = new FormData(form);
      const messageData = {
        content: formData.get('message') as string,
        senderEmail: formData.get('email') as string,
        receiverEmail: agentEmail,
        propertyId: propertyId
      };

      await sendMessage(messageData);
      form.reset();
      setFormError('');
      alert('Message sent successfully!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFormError(`An error occurred: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-30px mb-10">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Your e-mail*"
          className="text-paragraph-color px-5 py-15px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
          required
        />
        <textarea
          name="message"
          placeholder="Write Message..."
          className="min-h-[150px] text-paragraph-color px-5 py-15px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color block w-full rounded-none"
          required
        ></textarea>
      </div>

      <div className="mb-30px">
        {formError && (
          <p className="text-red-500 text-sm mt-2">{formError}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-secondary-color hover:bg-primary-color text-white py-3 px-6 transition-colors duration-300"
      >
        Send Message
      </button>
    </form>
  );
}; 
export default ContactForm;