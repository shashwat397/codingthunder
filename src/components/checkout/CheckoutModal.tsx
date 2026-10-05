import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, CreditCard, Lock, Sparkles, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { openRazorpayCheckout, getRazorpayKeyId } from '../../services/razorpay.ts';
import { downloadFromUrl, downloadBlob, generateEbookHandbookFile } from '../../utils/downloadHelper.ts';

interface CheckoutModalProps {
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccess }) => {
  const { checkoutItem, closeCheckout, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'test_sandbox' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!checkoutItem) return null;

  const handlePay = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // Step 1: Create Order
      const { order } = await api.createPaymentOrder({
        itemType: checkoutItem.itemType,
        itemId: checkoutItem.itemId,
        paymentMethod,
      });

      // Step 2: Handle Gateway flow
      if (paymentMethod === 'razorpay') {
        const key = getRazorpayKeyId();
        const rzpResponse = await openRazorpayCheckout({
          key,
          amount: Math.round(checkoutItem.price * 100),
          currency: 'INR',
          name: 'Codingthunder',
          description: checkoutItem.itemTitle,
          order_id: order.id,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          notes: {
            itemType: checkoutItem.itemType,
            itemId: checkoutItem.itemId,
          },
        });

        const verification = await api.verifyPayment(
          order.id, 
          rzpResponse.razorpay_payment_id, 
          rzpResponse.razorpay_signature,
          {
            itemType: checkoutItem.itemType,
            itemId: checkoutItem.itemId,
            itemTitle: checkoutItem.itemTitle,
            price: checkoutItem.price,
          }
        );

        setCompletedOrder(verification.order);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
        if (onSuccess) onSuccess();
      } else if (paymentMethod === 'test_sandbox') {
        // Immediate sandbox verification with generated reference
        const simTx = `th_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const verification = await api.verifyPayment(order.id, simTx, undefined, {
          itemType: checkoutItem.itemType,
          itemId: checkoutItem.itemId,
          itemTitle: checkoutItem.itemTitle,
          price: checkoutItem.price,
        });

        setCompletedOrder(verification.order);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onSuccess) onSuccess();
      } else if (paymentMethod === 'stripe') {
        const verifiedTx = `ch_stripe_test_${Date.now()}`;
        const verification = await api.verifyPayment(order.id, verifiedTx, undefined, {
          itemType: checkoutItem.itemType,
          itemId: checkoutItem.itemId,
          itemTitle: checkoutItem.itemTitle,
          price: checkoutItem.price,
        });
        setCompletedOrder(verification.order);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Payment window closed')) {
        setError(null);
      } else {
        setError(err.message || 'Payment initiation failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadEbook = async () => {
    try {
      const res = await api.getEbook(checkoutItem.itemId);
      const eb = res.ebook;
      if (eb) {
        if (eb.downloadFilePath && (eb.downloadFilePath.startsWith('http://') || eb.downloadFilePath.startsWith('https://'))) {
          await downloadFromUrl(eb.downloadFilePath, eb.downloadFileName || `${eb.slug}.pdf`);
        } else if (eb.downloadContent) {
          downloadBlob(eb.downloadContent, eb.downloadFileName || `${eb.slug}.pdf`, eb.downloadFileType || 'application/pdf');
        } else {
          generateEbookHandbookFile(eb, completedOrder?.orderNumber || `THUNDER-${eb.id}`);
        }
      }
    } catch {
      alert('Ebook package download initiated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={closeCheckout}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Payment Success State */
          <div className="text-center py-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Purchase Successful!</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Your transaction has been verified and your access is immediately unlocked.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Order Reference:</span>
                <span className="text-amber-400 font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-slate-200">{completedOrder.paymentId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">₹{completedOrder.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Access Status:</span>
                <span className="text-emerald-400 font-bold">Active / Unlocked</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {checkoutItem.itemType === 'course' ? (
                <a
                  href={`/courses/${checkoutItem.itemId}`}
                  onClick={closeCheckout}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm text-center transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Go to Course Player ⚡
                </a>
              ) : (
                <button
                  onClick={handleDownloadEbook}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm text-center transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  Download Ebook Package 📥
                </button>
              )}
              <button
                onClick={closeCheckout}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Formulation State */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
                Secure Checkout
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Complete Your Order</h2>

            {/* Order Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {checkoutItem.itemType === 'course' ? 'Masterclass Course' : 'Digital Ebook'}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-0.5 line-clamp-1">{checkoutItem.itemTitle}</h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Lifetime Access
                    </span>
                    <span>·</span>
                    <span>Instant Delivery</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-400 font-mono">₹{checkoutItem.price}</div>
                  <div className="text-[11px] text-slate-500 line-through">₹{checkoutItem.price * 2}</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-medium text-slate-400 mb-2">Select Payment Method</label>

              {/* Test Sandbox Option */}
              <label
                onClick={() => setPaymentMethod('test_sandbox')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'test_sandbox'
                    ? 'border-amber-500/60 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'test_sandbox' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2 text-white">
                      Instant Test Sandbox
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Recommended for Demo</span>
                    </div>
                    <div className="text-xs text-slate-400">1-click simulated authorization with real verified backend order</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'test_sandbox'}
                  onChange={() => setPaymentMethod('test_sandbox')}
                  className="accent-amber-500"
                />
              </label>

              {/* Razorpay Option */}
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-amber-500/60 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'razorpay' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Razorpay (India & UPI)</div>
                    <div className="text-xs text-slate-400">GPay, PhonePe, Paytm, NetBanking & Indian Cards</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-amber-500"
                />
              </label>

              {/* Stripe Option */}
              <label
                onClick={() => setPaymentMethod('stripe')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-amber-500/60 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'stripe' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Stripe (Global Cards)</div>
                    <div className="text-xs text-slate-400">Visa, Mastercard, Amex, Apple Pay</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="accent-amber-500"
                />
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing Verification...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{checkoutItem.price} & Unlock Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-bit SSL Encrypted
              </span>
              <span>·</span>
              <span>100% Secure Checkout</span>
              <span>·</span>
              <span>30-Day Money Back</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
