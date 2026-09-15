import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat({ whatsapp }) {
  const number = whatsapp?.phoneNumber || '';
  if (!number || whatsapp?.showFloatingButton === false) return null;
  const text = whatsapp?.defaultMessage || 'Hi Aayush, I found your portfolio and want to chat.';
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title={whatsapp?.businessHours ? `WhatsApp · ${whatsapp.businessHours}` : 'Chat on WhatsApp'}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}
