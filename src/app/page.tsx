import { CryptoProfitGazer } from '@/components/crypto-profit-gazer';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 pt-12 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <CryptoProfitGazer />
      </div>
    </main>
  );
}
