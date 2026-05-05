import { useState, useEffect } from 'react';
import styles from './AdminPage.module.css';
import { Lock, LogIn, LogOut, Home, Users, Plus, Trash2, Home as HomeIcon, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    description?: string;
    whatsapp?: string;
}

interface FeaturedPropertyItem {
    id: string;
    title: string;
    price: string;
    location: string;
    imageUrl: string;
    linkUrl: string;
    operationType: string;
}

const OPERATION_TYPES = ['En Venta', 'En Alquiler', 'Alquiler Temporal', 'Oportunidad', 'Nuevo Ingreso'];

const emptyProperty = { title: '', price: '', location: '', imageUrl: '', linkUrl: '', operationType: 'En Venta' };

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    // Team management state
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [newMember, setNewMember] = useState<Partial<TeamMember>>({ name: '', role: '', image: '', description: '', whatsapp: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Featured Property state (Hero)
    const [featuredProperty, setFeaturedProperty] = useState({
        imageUrl: '',
        price: '',
        location: '',
        title: '',
        linkUrl: ''
    });
    const [isSavingProperty, setIsSavingProperty] = useState(false);

    // Featured Properties List state
    const [featuredProperties, setFeaturedProperties] = useState<FeaturedPropertyItem[]>([]);
    const [newProperty, setNewProperty] = useState<Omit<FeaturedPropertyItem, 'id'>>(emptyProperty);
    const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
    const [isSavingNewProperty, setIsSavingNewProperty] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'team'), orderBy('createdAt', 'asc'));
        const unsubscribeTeam = onSnapshot(q, (snapshot) => {
            const members = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as TeamMember[];
            setTeamMembers(members);
        });

        const unsubscribeHero = onSnapshot(doc(db, 'settings', 'hero_property'), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setFeaturedProperty(docSnapshot.data() as any);
            }
        });

        const qProps = query(collection(db, 'featured_properties'), orderBy('createdAt', 'asc'));
        const unsubscribeProps = onSnapshot(qProps, (snapshot) => {
            const props = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FeaturedPropertyItem[];
            setFeaturedProperties(props);
        });

        return () => {
            unsubscribeTeam();
            unsubscribeHero();
            unsubscribeProps();
        };
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    const saveTeamMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId && teamMembers.length >= 10) return;
        if (!newMember.name || !newMember.role) return;

        try {
            if (editingId) {
                await setDoc(doc(db, 'team', editingId), {
                    name: newMember.name,
                    role: newMember.role,
                    image: newMember.image || '',
                    description: newMember.description || '',
                    whatsapp: newMember.whatsapp || '',
                    updatedAt: serverTimestamp()
                }, { merge: true });
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'team'), {
                    name: newMember.name,
                    role: newMember.role,
                    image: newMember.image || '',
                    description: newMember.description || '',
                    whatsapp: newMember.whatsapp || '',
                    createdAt: serverTimestamp()
                });
            }
            setNewMember({ name: '', role: '', image: '', description: '', whatsapp: '' });
        } catch (err) {
            console.error("Error saving document: ", err);
        }
    };

    const handleEditClick = (member: TeamMember) => {
        setEditingId(member.id);
        setNewMember({
            name: member.name,
            role: member.role,
            image: member.image || '',
            description: member.description || '',
            whatsapp: member.whatsapp || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewMember({ name: '', role: '', image: '', description: '', whatsapp: '' });
    };

    const removeTeamMember = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'team', id));
        } catch (err) {
            console.error("Error deleting document: ", err);
        }
    };

    const saveFeaturedProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProperty(true);
        try {
            await setDoc(doc(db, 'settings', 'hero_property'), featuredProperty);
            setIsSavingProperty(false);
        } catch (err) {
            console.error("Error saving featured property: ", err);
            setIsSavingProperty(false);
        }
    };

    const saveFeaturedPropertyItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPropertyId && featuredProperties.length >= 5) return;
        if (!newProperty.title || !newProperty.price || !newProperty.location) return;

        setIsSavingNewProperty(true);
        try {
            if (editingPropertyId) {
                await setDoc(doc(db, 'featured_properties', editingPropertyId), {
                    ...newProperty,
                    updatedAt: serverTimestamp()
                }, { merge: true });
                setEditingPropertyId(null);
            } else {
                await addDoc(collection(db, 'featured_properties'), {
                    ...newProperty,
                    createdAt: serverTimestamp()
                });
            }
            setNewProperty(emptyProperty);
        } catch (err) {
            console.error("Error saving property: ", err);
        } finally {
            setIsSavingNewProperty(false);
        }
    };

    const handleEditPropertyClick = (property: FeaturedPropertyItem) => {
        setEditingPropertyId(property.id);
        setNewProperty({
            title: property.title,
            price: property.price,
            location: property.location,
            imageUrl: property.imageUrl || '',
            linkUrl: property.linkUrl || '',
            operationType: property.operationType || 'En Venta'
        });
    };

    const cancelPropertyEdit = () => {
        setEditingPropertyId(null);
        setNewProperty(emptyProperty);
    };

    const deleteFeaturedProperty = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'featured_properties', id));
        } catch (err) {
            console.error("Error deleting property: ", err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.adminWrapper}>
                <div className={styles.loginContainer}>
                    <Link to="/" className={styles.backHome}>
                        <Home size={18} /> Volver a la web
                    </Link>
                    <div className={styles.glassLogin}>
                        <div className={styles.iconWrapper}>
                            <Lock size={32} />
                        </div>
                        <h2 className={styles.title}>Panel de Control</h2>
                        <p className={styles.subtitle}>Ingresá tu contraseña para acceder</p>

                        <form onSubmit={handleLogin} className={styles.loginForm}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                                />
                                {error && <span className={styles.errorText}>Contraseña incorrecta</span>}
                            </div>

                            <button type="submit" className={styles.loginBtn}>
                                <LogIn size={18} /> Iniciar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardWrapper}>
            <header className={styles.dashboardHeader}>
                <div className={styles.headerLogo}>
                    <strong>GARCIA</strong> PROPIEDADES <span className={styles.badge}>Admin</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} /> Salir
                </button>
            </header>

            <main className={`container ${styles.dashboardMain}`}>
                <h1 className={styles.dashboardTitle}>Panel de Administración</h1>
                <p className={styles.dashboardSubtitle}>
                    Gestión de contenidos y configuración del sitio web.
                </p>

                {/* Team Section */}
                <div className={styles.adminSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleGroup}>
                            <Users size={24} className={styles.sectionIcon} />
                            <h2>Gestión de Equipo</h2>
                        </div>
                        <span className={styles.memberCount}>
                            {teamMembers.length} / 10 Miembros
                        </span>
                    </div>

                    <div className={styles.teamManagerGrid}>
                        <div className={styles.formColumn}>
                            <h3>{editingId ? 'Editar miembro' : 'Agregar nuevo miembro'}</h3>
                            <form onSubmit={saveTeamMember} className={styles.teamForm}>
                                <div className={styles.inputGroup}>
                                    <label>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="Ej: Juan Pérez"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Rol en la empresa *</label>
                                    <input
                                        type="text"
                                        value={newMember.role}
                                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                        placeholder="Ej: Asesor de Ventas"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL de la foto (opcional)</label>
                                    <input
                                        type="url"
                                        value={newMember.image}
                                        onChange={e => setNewMember({ ...newMember, image: e.target.value })}
                                        placeholder="https://..."
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Breve descripción</label>
                                    <textarea
                                        value={newMember.description}
                                        onChange={e => setNewMember({ ...newMember, description: e.target.value })}
                                        placeholder="Experto en tasaciones..."
                                        className={styles.textarea}
                                        rows={3}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>WhatsApp (opcional)</label>
                                    <input
                                        type="tel"
                                        value={newMember.whatsapp}
                                        onChange={e => setNewMember({ ...newMember, whatsapp: e.target.value })}
                                        placeholder="Ej: 5493794088400"
                                        className={styles.input}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="submit"
                                        className={styles.primaryBtn}
                                        disabled={!editingId && teamMembers.length >= 10}
                                        style={{ flex: 1 }}
                                    >
                                        <Plus size={18} />
                                        {editingId ? 'Guardar Cambios' : (teamMembers.length >= 10 ? 'Límite alcanzado' : 'Agregar Miembro')}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {!editingId && teamMembers.length >= 10 && (
                                    <p className={styles.errorText}>No puedes agregar más de 10 miembros.</p>
                                )}
                            </form>
                        </div>

                        <div className={styles.listColumn}>
                            <h3>Miembros Actuales</h3>
                            <div className={styles.memberList}>
                                {teamMembers.length === 0 ? (
                                    <p className={styles.emptyState}>No hay miembros en el equipo.</p>
                                ) : (
                                    teamMembers.map(member => (
                                        <div key={member.id} className={styles.memberListItem}>
                                            <div className={styles.memberInfo}>
                                                <div className={styles.memberAvatar}>
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} />
                                                    ) : (
                                                        <Users size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4>{member.name}</h4>
                                                    <span>{member.role}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEditClick(member)}
                                                    style={{ color: 'var(--primary-light)', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => removeTeamMember(member.id)}
                                                    className={styles.deleteBtn}
                                                    title="Eliminar miembro"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Properties Section */}
                <div className={styles.adminSection} style={{ marginTop: '2rem' }}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleGroup}>
                            <Building2 size={24} className={styles.sectionIcon} />
                            <h2>Propiedades Destacadas</h2>
                        </div>
                        <span className={styles.memberCount}>
                            {featuredProperties.length} / 5 Propiedades
                        </span>
                    </div>

                    <div className={styles.teamManagerGrid}>
                        <div className={styles.formColumn}>
                            <h3>{editingPropertyId ? 'Editar propiedad' : 'Agregar propiedad'}</h3>
                            <form onSubmit={saveFeaturedPropertyItem} className={styles.teamForm}>
                                <div className={styles.inputGroup}>
                                    <label>Tipo de operación *</label>
                                    <select
                                        value={newProperty.operationType}
                                        onChange={e => setNewProperty({ ...newProperty, operationType: e.target.value })}
                                        className={styles.input}
                                        required
                                    >
                                        {OPERATION_TYPES.map(op => (
                                            <option key={op} value={op}>{op}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Descripción / Tipo *</label>
                                    <input
                                        type="text"
                                        value={newProperty.title}
                                        onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                                        placeholder="Ej: Casa 3 ambientes con patio"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Precio *</label>
                                    <input
                                        type="text"
                                        value={newProperty.price}
                                        onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
                                        placeholder="Ej: U$S 120.000 o $450.000/mes"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Ubicación *</label>
                                    <input
                                        type="text"
                                        value={newProperty.location}
                                        onChange={e => setNewProperty({ ...newProperty, location: e.target.value })}
                                        placeholder="Ej: San Lorenzo 1200, Corrientes"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL de la imagen</label>
                                    <input
                                        type="url"
                                        value={newProperty.imageUrl}
                                        onChange={e => setNewProperty({ ...newProperty, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Link a la publicación</label>
                                    <input
                                        type="url"
                                        value={newProperty.linkUrl}
                                        onChange={e => setNewProperty({ ...newProperty, linkUrl: e.target.value })}
                                        placeholder="https://www.inmogp.com/propiedad/..."
                                        className={styles.input}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="submit"
                                        className={styles.primaryBtn}
                                        disabled={(!editingPropertyId && featuredProperties.length >= 5) || isSavingNewProperty}
                                        style={{ flex: 1 }}
                                    >
                                        <Plus size={18} />
                                        {isSavingNewProperty
                                            ? 'Guardando...'
                                            : editingPropertyId
                                                ? 'Guardar Cambios'
                                                : (featuredProperties.length >= 5 ? 'Límite alcanzado' : 'Agregar Propiedad')}
                                    </button>

                                    {editingPropertyId && (
                                        <button
                                            type="button"
                                            onClick={cancelPropertyEdit}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {!editingPropertyId && featuredProperties.length >= 5 && (
                                    <p className={styles.errorText}>Límite de 5 propiedades alcanzado. Eliminá una para agregar otra.</p>
                                )}
                            </form>
                        </div>

                        <div className={styles.listColumn}>
                            <h3>Propiedades Actuales</h3>
                            <div className={styles.memberList}>
                                {featuredProperties.length === 0 ? (
                                    <p className={styles.emptyState}>No hay propiedades destacadas todavía.</p>
                                ) : (
                                    featuredProperties.map(property => (
                                        <div key={property.id} className={styles.memberListItem}>
                                            <div className={styles.memberInfo}>
                                                <div className={styles.memberAvatar} style={{ borderRadius: '8px', background: 'rgba(205,25,19,0.1)' }}>
                                                    {property.imageUrl ? (
                                                        <img src={property.imageUrl} alt={property.title} style={{ borderRadius: '8px' }} />
                                                    ) : (
                                                        <Building2 size={20} style={{ color: 'var(--primary-light)' }} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '0.9rem' }}>{property.title}</h4>
                                                    <span style={{ color: 'var(--primary-light)', fontSize: '0.8rem' }}>{property.operationType} · {property.price}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEditPropertyClick(property)}
                                                    style={{ color: 'var(--primary-light)', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => deleteFeaturedProperty(property.id)}
                                                    className={styles.deleteBtn}
                                                    title="Eliminar propiedad"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Property Section */}
                <div className={styles.adminSection} style={{ marginTop: '2rem' }}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleGroup}>
                            <HomeIcon size={24} className={styles.sectionIcon} style={{ color: 'var(--primary)' }} />
                            <h2>Propiedad Destacada (Inicio)</h2>
                        </div>
                    </div>

                    <div className={styles.teamManagerGrid}>
                        <div className={styles.formColumn}>
                            <h3>Destacar en el Hero</h3>
                            <form onSubmit={saveFeaturedProperty} className={styles.teamForm}>
                                <div className={styles.inputGroup}>
                                    <label>Título / Operación</label>
                                    <input
                                        type="text"
                                        value={featuredProperty.title}
                                        onChange={e => setFeaturedProperty({ ...featuredProperty, title: e.target.value })}
                                        placeholder="Ej: Propiedad Destacada, Nuevo Ingreso..."
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Precio</label>
                                    <input
                                        type="text"
                                        value={featuredProperty.price}
                                        onChange={e => setFeaturedProperty({ ...featuredProperty, price: e.target.value })}
                                        placeholder="Ej: U$S 250.000, Consultar..."
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Ubicación Breve</label>
                                    <input
                                        type="text"
                                        value={featuredProperty.location}
                                        onChange={e => setFeaturedProperty({ ...featuredProperty, location: e.target.value })}
                                        placeholder="Ej: San Lorenzo, Corrientes Capital"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL de la Imagen</label>
                                    <input
                                        type="url"
                                        value={featuredProperty.imageUrl}
                                        onChange={e => setFeaturedProperty({ ...featuredProperty, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL de Publicación</label>
                                    <input
                                        type="url"
                                        value={featuredProperty.linkUrl || ''}
                                        onChange={e => setFeaturedProperty({ ...featuredProperty, linkUrl: e.target.value })}
                                        placeholder="https://www.inmogp.com/propiedad/..."
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.primaryBtn}
                                    style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #172121 100%)' }}
                                    disabled={isSavingProperty}
                                >
                                    {isSavingProperty ? 'Guardando...' : 'Guardar Propiedad'}
                                </button>
                            </form>
                        </div>

                        <div className={styles.listColumn}>
                            <h3>Vista Previa Actual</h3>
                            {featuredProperty.title ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: '#172121', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                    <img
                                        src={featuredProperty.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                                        alt="Vista previa"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                                            {featuredProperty.title}
                                        </p>
                                        <h4 style={{ fontSize: '1.2rem', margin: '0' }}>{featuredProperty.price}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0' }}>{featuredProperty.location}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.emptyState}>No hay datos cargados todavía.</p>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminPage;
