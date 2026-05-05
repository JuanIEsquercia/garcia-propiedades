import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import styles from './Team.module.css';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    description?: string;
    whatsapp?: string;
}

const defaultTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Roberto Garcia',
        role: 'Director y Fundador',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Más de 30 años de experiencia liderando el mercado inmobiliario.'
    },
    {
        id: '2',
        name: 'Laura Martinez',
        role: 'Asesora Inmobiliaria',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Especialista en atención personalizada e inversiones seguras.'
    },
    {
        id: '3',
        name: 'Carlos Mendez',
        role: 'Especialista en Emprendimientos',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Buscando las mejores rentabilidades en proyectos de pozo.'
    },
    {
        id: '4',
        name: 'Sofia Lopez',
        role: 'Administración de Alquileres',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Gestión ágil y transparente para propietarios e inquilinos.'
    }
];

const Team = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'team'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setTeamMembers(defaultTeamMembers);
            } else {
                const members = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as TeamMember[];
                setTeamMembers(members);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <section id="equipo" className={styles.teamSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.badge}>Equipo de Trabajo</div>
                    <h2 className={styles.title}>
                        Profesionales a tu <span className="text-gradient">disposición</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Conocé a las personas que hacen posible que encuentres tu lugar ideal.
                        Nuestro equipo está altamente capacitado para asesorarte.
                    </p>
                </div>

                <div className={styles.grid}>
                    {teamMembers.map((member) => (
                        <div key={member.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={member.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt={member.name} className={styles.image} />
                            </div>
                            <div className={styles.info}>
                                <h4 className={styles.name}>{member.name}</h4>
                                <p className={styles.role}>{member.role}</p>
                                {member.description && (
                                    <p className={styles.description}>{member.description}</p>
                                )}
                                {member.whatsapp && (
                                    <a
                                        href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(member.name)}%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20me%20gustar%C3%ADa%20hacerte%20una%20consulta.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.whatsappBtn}
                                    >
                                        Contactar por WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
