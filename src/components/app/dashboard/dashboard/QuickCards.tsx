import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import React from 'react';

interface QuickCardsProps {
}
const QuickCards: React.FC<QuickCardsProps> = (props) => {
    //HOOKS
    const router = useRouter();
    //STATES

    //VARIABLES
    const cards = [
        { title: 'Complete Profile', description: 'Complete your profile to get personalized recommendations.', icon: '👤', class: '!bg-yellow-50', visible: true, buttonText: 'Build Profile', buttonUrl: '/dashboard' },
        { title: 'Create a Project', description: 'Start a new project to get started.', icon: '📁', class: '!bg-blue-50', visible: true, buttonText: 'Create Project', buttonUrl: APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path },
        { title: 'Pay Your Invoice', description: 'Pay your invoice to keep your account in good standing.', icon: '💳', class: '!bg-green-50', visible: true, buttonText: 'Pay Invoice', buttonUrl: '/dashboard' },
        { title: 'Get Support', description: 'Contact support for any questions or issues.', icon: '🛠️', class: '!bg-purple-50', visible: true, buttonText: 'Get Support', buttonUrl: '/dashboard' }]
    //FUNCTIONS

    //EFFECTS

    return (
        <div className='flex flex-row items-center justify-center w-full h-full p-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {cards.map((card, index) => (
                    <Card key={index} className={`${card.class} flex flex-col  p-4 bg-white rounded-lg `}>
                        <div className='text-3xl'>{card.icon}</div>
                        <h2 className='mt-2 text-xl font-bold'>{card.title}</h2>
                        <p className='mt-1 mb-4 text-sm text-gray-600'>{card.description}</p>
                        <Button onClick={() => router.push(card.buttonUrl)} className=' px-4 py-2 w-fit mt-auto ms-auto hover:scale-105 '>{card.buttonText}</Button>
                    </Card>
                ))}
            </div>

        </div>
    );
};

export default QuickCards;