'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    User,
    Phone,
    MapPin,
    Upload,
    CheckCircle,
    Loader2,
    ExternalLink,
    Shield,
    Crown,
    Sparkles,
    AlertCircle,
    ArrowLeft,
    Hash,
    UserPlus,
    TrendingUp,
    DollarSign,
    Package
} from 'lucide-react';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const REDIRECT_URI = typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth/discord/callback`
    : '';

// Discord SVG Icon Component
const DiscordIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const DiscordIconLarge = ({ className = "w-12 h-12" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

export default function RegisterPage() {
    const [step, setStep] = useState('discord'); // 'discord' | 'form' | 'pending' | 'status_approved'
    const [discordUser, setDiscordUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        nickname: '',
        country: '',
        contact: '',
        connextId: '',
        tradingViewName: '',
        referalName: '',
        referalId: '',
        itemsReceived: '',
        depositAmount: '',
        transferSlip: null,
    });

    // Check for Discord callback on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const discordData = params.get('discord');
        const errorParam = params.get('error');

        if (errorParam) {
            setError(`Discord login failed: ${errorParam}`);
        }

        if (discordData) {
            try {
                const userData = JSON.parse(decodeURIComponent(discordData));
                setDiscordUser(userData);

                // Check if user is already registered
                checkUserStatus(userData.username, userData);

                // Clean URL
                window.history.replaceState({}, '', '/wn_registry');
            } catch (e) {
                console.error('Failed to parse Discord data:', e);
                setError('Failed to parse Discord data');
            }
        }
    }, []);

    const checkUserStatus = async (username, userData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/status?username=${username}`);
            const data = await response.json();

            if (data.found && data.status === 'approved') {
                setStep('status_approved');
                setFormData(prev => ({ ...prev, expiresAt: data.expiresAt }));
            } else if (data.found && data.status === 'pending') {
                setStep('pending');
            } else {
                setStep('form');
            }
        } catch (e) {
            console.error('Check status failed, defaulting to form:', e);
            setStep('form');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscordLogin = () => {
        const scope = 'identify';
        const authUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}`;
        window.location.href = authUrl;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('ไฟล์มีขนาดใหญ่เกิน 10MB');
                return;
            }
            setFormData(prev => ({ ...prev, transferSlip: file }));
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const submitData = new FormData();
            submitData.append('firstName', formData.firstName);
            submitData.append('middleName', formData.middleName);
            submitData.append('lastName', formData.lastName);
            submitData.append('nickname', formData.nickname);
            submitData.append('country', formData.country);
            submitData.append('contact', formData.contact);
            submitData.append('connextId', formData.connextId);
            submitData.append('tradingViewName', formData.tradingViewName);
            submitData.append('referalName', formData.referalName);
            submitData.append('referalId', formData.referalId);
            submitData.append('itemsReceived', formData.itemsReceived);
            submitData.append('depositAmount', formData.depositAmount);
            submitData.append('discordId', discordUser?.id || '');
            submitData.append('discordUsername', discordUser?.username || '');
            if (formData.transferSlip) {
                submitData.append('transferSlip', formData.transferSlip);
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'การลงทะเบียนล้มเหลว');
            }

            setStep('pending');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.firstName &&
            formData.nickname &&
            formData.country &&
            formData.contact &&
            formData.connextId &&
            formData.transferSlip
        );
    };

    return (
        <main className="min-h-screen relative">
            {/* Background Effects - Fixed & Overflow Hidden */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="glow-circle glow-circle-1"></div>
                <div className="glow-circle glow-circle-2"></div>
                <div className="glow-circle glow-circle-purple"></div>
                <div className="absolute inset-0 bg-grid"></div>
                <div className="viewport-glow"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Back Button Container */}
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>กลับหน้าหลัก</span>
                    </Link>
                </div>

                {/* Main Content - EXACT Replica Layout */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full px-4">

                    {/* Header */}
                    <div className="text-center mb-10 w-full">
                        <div className="badge-vip mx-auto mb-4">
                            <Crown className="w-4 h-4" />
                            <span>1-Year VIP Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-wealth-light">
                            ลงทะเบียนสมาชิก
                        </h1>
                        <p className="text-text-secondary text-base md:text-lg">
                            เข้าร่วม Master Signal Trading Community
                        </p>
                    </div>

                    <div className="w-full max-w-2xl mx-auto">
                        {/* Discord Login Step */}
                        {step === 'discord' && (
                            <div
                                className="rounded-2xl text-center relative z-20 mx-auto w-full"
                                style={{
                                    maxWidth: '600px',
                                    backgroundColor: '#0f0f11',
                                    borderColor: 'rgba(255, 255, 255, 0.05)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    padding: '3.5rem',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="discord-icon-plain mx-auto mb-6">
                                    <DiscordIconLarge className="w-16 h-16 text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3">เข้าสู่ระบบด้วย Discord</h2>
                                <p className="text-text-secondary text-[15px] mb-8">
                                    กรุณายืนยันตัวตนผ่าน Discord ก่อนลงทะเบียน
                                </p>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6 text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleDiscordLogin}
                                    className="btn-discord"
                                >
                                    <DiscordIcon className="w-5 h-5" />
                                    เข้าสู่ระบบด้วย Discord
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-2 text-text-secondary text-sm">
                                    <Shield className="w-4 h-4" />
                                    <span>ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</span>
                                </div>
                            </div>
                        )}

                        {/* Registration Form Step */}
                        {step === 'form' && (
                            <div className="glass rounded-2xl p-6 sm:p-8 animate-fadeIn w-full relative z-20">
                                {/* Discord User Info */}
                                {discordUser && (
                                    <div className="flex items-center gap-4 p-4 bg-discord/10 rounded-xl mb-8 border border-discord/20">
                                        <img
                                            src={discordUser.avatar
                                                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=64`
                                                : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`
                                            }
                                            alt="Discord Avatar"
                                            className="w-14 h-14 min-w-[56px] min-h-[56px] shrink-0 rounded-full border-2 border-discord object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-white font-semibold text-lg">
                                                {discordUser.global_name || discordUser.username}
                                            </p>
                                            <p className="text-text-secondary text-sm">
                                                @{discordUser.username}
                                            </p>
                                        </div>
                                        <CheckCircle className="w-6 h-6 text-green ml-auto" />
                                    </div>
                                )}

                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-wealth" />
                                    กรอกข้อมูลลงทะเบียน
                                </h2>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6 text-red-400">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <User className="w-4 h-4 inline mr-1" />
                                            First Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="ชื่อ (Name)"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    {/* Nickname */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Nickname <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nickname"
                                            value={formData.nickname}
                                            onChange={handleInputChange}
                                            placeholder="ชื่อเล่น"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            Country <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="เช่น Thailand, Malaysia"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    {/* Contact (ID Line / Phone Number) */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            ID Line / Phone Number / Your Contact <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            placeholder="Line ID หรือ เบอร์โทรศัพท์"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    {/* Connext ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <Hash className="w-4 h-4 inline mr-1" />
                                            Connext ID <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="connextId"
                                            value={formData.connextId}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                handleInputChange({ target: { name: 'connextId', value: val } });
                                            }}
                                            placeholder="กรอกตัวเลข Connext ID"
                                            className="form-input"
                                            required
                                            inputMode="numeric"
                                        />
                                        <p className="mt-1 text-xs text-text-secondary">ตัวเลขจาก Connext FX</p>
                                    </div>

                                    {/* Trading View Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <TrendingUp className="w-4 h-4 inline mr-1" />
                                            ชื่อ Trading View
                                        </label>
                                        <input
                                            type="text"
                                            name="tradingViewName"
                                            value={formData.tradingViewName}
                                            onChange={handleInputChange}
                                            placeholder="Trading View Username"
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Referal Name & ID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                <UserPlus className="w-4 h-4 inline mr-1" />
                                                Your Referal Name
                                            </label>
                                            <input
                                                type="text"
                                                name="referalName"
                                                value={formData.referalName}
                                                onChange={handleInputChange}
                                                placeholder="ชื่อผู้แนะนำ"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Referral ID
                                            </label>
                                            <input
                                                type="text"
                                                name="referalId"
                                                value={formData.referalId}
                                                onChange={handleInputChange}
                                                placeholder="ID ผู้แนะนำ"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Items Received */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <Package className="w-4 h-4 inline mr-1" />
                                            Items that have already been received
                                        </label>
                                        <input
                                            type="text"
                                            name="itemsReceived"
                                            value={formData.itemsReceived}
                                            onChange={handleInputChange}
                                            placeholder="รายการที่ได้รับแล้ว"
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Deposit Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            ฝากเงินเข้าพอร์ตเทรด Connext ไปแล้วกี่ $
                                        </label>
                                        <input
                                            type="text"
                                            name="depositAmount"
                                            value={formData.depositAmount}
                                            onChange={handleInputChange}
                                            placeholder="จำนวนเงินที่ฝาก (USD)"
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Middle Name & Last Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Middle Name
                                            </label>
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={formData.middleName}
                                                onChange={handleInputChange}
                                                placeholder="ชื่อกลาง (ถ้ามี)"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="นามสกุล"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Transfer Slip Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            <Upload className="w-4 h-4 inline mr-1" />
                                            Payment Slip (สลิปการโอนเงิน) <span className="text-red-400">*</span>
                                        </label>
                                        <div className={`file-upload ${formData.transferSlip ? 'has-file' : ''}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                required
                                            />
                                            {formData.transferSlip ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <CheckCircle className="w-8 h-8 text-green" />
                                                    <div className="text-left">
                                                        <p className="text-white font-medium">{formData.transferSlip.name}</p>
                                                        <p className="text-text-secondary text-sm">
                                                            {(formData.transferSlip.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="w-10 h-10 text-wealth mx-auto mb-2" />
                                                    <p className="text-white font-medium">คลิกเพื่ออัพโหลดรูปภาพ</p>
                                                    <p className="text-text-secondary text-sm mt-1">PNG, JPG หรือ JPEG (สูงสุด 10MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={!isFormValid() || isLoading}
                                        className="btn-wealth w-full py-4 text-lg mt-6"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                กำลังส่งข้อมูล...
                                            </>
                                        ) : (
                                            <>
                                                ส่งข้อมูลลงทะเบียน
                                                <ExternalLink className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Pending Approval Step */}
                        {step === 'pending' && (
                            <div className="glass rounded-2xl p-8 sm:p-12 text-center animate-fadeIn">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-wealth/20 to-wealth-light/20 flex items-center justify-center mx-auto mb-6 animate-pulse-wealth">
                                    <CheckCircle className="w-12 h-12 text-green" />
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                                    <span className="wealth-gradient">รอการอนุมัติ</span>
                                </h2>

                                <p className="text-text-secondary text-lg mb-6">
                                    ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว<br />
                                    กรุณารอการอนุมัติจากแอดมิน
                                </p>

                                <div className="glass rounded-xl p-4 inline-flex items-center gap-3 mb-8">
                                    <div className="w-3 h-3 bg-wealth-light rounded-full animate-pulse"></div>
                                    <span className="text-wealth-light font-medium">รอการตรวจสอบ</span>
                                </div>

                                <div className="space-y-3 text-text-secondary text-sm max-w-md mx-auto mb-8">
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                                        <span className="text-left">แอดมินจะตรวจสอบหลักฐานการโอนเงินของคุณ</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                                        <span className="text-left">เมื่ออนุมัติ คุณจะได้รับ VIP Role บน Discord โดยอัตโนมัติ</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                                        <span className="text-left">VIP Role จะมีอายุ 1 ปี นับจากวันที่อนุมัติ</span>
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-white font-semibold mb-4 text-lg">⚡ ขั้นตอนถัดไป: เข้าร่วม Discord Server</p>
                                    <a
                                        href="https://discord.gg/MSD6nnSH3j"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-discord inline-flex gap-2"
                                    >
                                        <DiscordIcon className="w-6 h-6" />
                                        เข้าร่วม Discord Server
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <p className="text-text-secondary text-sm mt-3">คุณต้องเข้า Server ก่อน จึงจะได้รับ VIP Role เมื่ออนุมัติ</p>
                                </div>
                            </div>
                        )}

                        {/* Approved Status Step */}
                        {step === 'status_approved' && (
                            <div className="glass rounded-2xl p-8 sm:p-12 text-center animate-fadeIn">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green" />
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                                    <span className="text-white">คุณได้รับสิทธิ์ VIP แล้ว</span>
                                </h2>

                                <div className="glass rounded-xl p-6 mb-8 border border-wealth/30">
                                    <p className="text-text-secondary mb-2">สถานะสมาชิก</p>
                                    <div className="flex items-center justify-center gap-2 text-wealth-light text-xl font-bold mb-4">
                                        <Crown className="w-6 h-6" />
                                        1-Year VIP Access
                                    </div>

                                    {formData.expiresAt && (
                                        <div className="text-sm border-t border-white/10 pt-4 mt-2">
                                            <p className="text-text-secondary mb-1">วันหมดอายุ (Expiry Date)</p>
                                            <p className="text-white text-lg font-mono">
                                                {new Date(formData.expiresAt).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href="https://discord.gg/MSD6nnSH3j"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-discord inline-flex gap-2 w-full justify-center"
                                >
                                    <DiscordIcon className="w-6 h-6" />
                                    เข้าร่วม Discord Server
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <p className="text-text-secondary text-sm mt-3">คุณต้องเข้า Server ก่อน จึงจะได้รับ VIP Role</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
