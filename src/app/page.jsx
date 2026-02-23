import Link from 'next/link';
import { Crown, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="glow-circle glow-circle-1"></div>
                <div className="glow-circle glow-circle-2"></div>
                <div className="glow-circle glow-circle-3"></div>
            </div>

            <div className="page-center relative z-10 px-4 py-12">
                <div className="card-container">
                    {/* Main Card */}
                    <div className="glass rounded-3xl p-8 sm:p-12 text-center animate-fadeIn">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="logo-box">
                                <TrendingUp className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="badge-vip mx-auto mb-6">
                            <Crown className="w-4 h-4" />
                            <span>Exclusive Access</span>
                        </div>

                        {/* Headlines */}
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            <span className="wealth-gradient">Master Signal</span>
                            <span className="text-white"> Registry</span>
                        </h1>

                        <p className="text-text-secondary text-lg mb-8">
                            ลงทะเบียนเพื่อรับสิทธิ์{" "}
                            <span className="text-wealth-light font-semibold">1-Year VIP Access</span>
                            <br />
                            เข้าถึง Trading Signals และ Community พิเศษ
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-wealth/10">
                                <Shield className="w-5 h-5 text-wealth-light flex-shrink-0" />
                                <span className="text-sm text-gray-300">ยืนยันตัวตนผ่าน Discord</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-wealth/10">
                                <Crown className="w-5 h-5 text-wealth-light flex-shrink-0" />
                                <span className="text-sm text-gray-300">VIP Role อัตโนมัติ</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/wn_registry"
                            className="btn-wealth w-full py-4 text-lg group"
                        >
                            <span>เริ่มลงทะเบียน</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Footer Note */}
                        <p className="mt-8 text-xs text-gray-500">
                            โดยการลงทะเบียน คุณยอมรับข้อกำหนดการใช้งาน
                        </p>
                    </div>

                    {/* Bottom Glow */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-wealth/20 blur-3xl rounded-full"></div>
                </div>
            </div>
        </main>
    );
}
