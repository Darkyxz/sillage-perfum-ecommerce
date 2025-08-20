import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactButton = () => {
    return (
        <Link
            to="/contacto"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sillage-gold text-foreground rounded-md hover:bg-opacity-90 transition-all duration-200 font-medium"
        >
            <UserRound size={18} />
            Contacto
        </Link>
    );
};

export default ContactButton;