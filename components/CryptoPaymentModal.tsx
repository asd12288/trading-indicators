"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PaymentDetails from "./PaymentDetails";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

type CurrencyOption = {
  name: string;
  label: string;
  icon: string;
  popular?: boolean;
  network?: string;
  uniqueId?: string;
};

export default function CryptoPaymentModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    address: string;
    amount: string;
    currency: string;
    expiresAt: string;
  } | null>(null);

  // Popular cryptocurrencies to highlight
  const popularCoins = [
    "btc",
    "eth",
    "usdt",
    "usdttrc20",
    "ltc",
    "xrp",
    "doge",
    "trx",
  ];

  // Fetch the list of available currencies from your API
  useEffect(() => {
    async function fetchCurrencies() {
      setLoading(true);
      try {
        const res = await fetch("/api/currencies");
        const json = await res.json();

        if (json?.currencies) {
          // Get the currencies array, handling both array and nested object format
          const currenciesArray = Array.isArray(json.currencies)
            ? json.currencies
            : json.currencies.currencies || Object.values(json.currencies);

          const options = currenciesArray.map((currency: any) => {
            // Get code/name from the API
            const name = currency.code.toLowerCase();
            let label = currency.name || currency.code.toUpperCase();

            // Use the network field directly from API when available
            let network = "";
            if (currency.network) {
              // Map network codes to readable names
              const networkMap: Record<string, string> = {
                eth: "Ethereum",
                bsc: "BSC",
                trx: "Tron",
                tron: "Tron",
                ada: "Cardano",
              };

              network =
                networkMap[currency.network] ||
                currency.network.charAt(0).toUpperCase() +
                  currency.network.slice(1);
            }

            // Keep your token network logic as fallback for older data
            if (!network) {
              if (name.includes("erc20")) {
                label = label.replace("ERC20", "");
                network = "Ethereum";
              } else if (name.includes("trc20")) {
                label = label.replace("TRC20", "");
                network = "Tron";
              } else if (name.includes("bep20")) {
                label = label.replace("BEP20", "");
                network = "BSC";
              }
            }

            // Create a unique ID by combining name and network
            const uniqueId = network
              ? `${name}-${network.toLowerCase()}`
              : name;

            return {
              name: name,
              label: label.trim(),
              icon: currency.logo_url.toLowerCase(),
              popular: popularCoins.includes(name),
              network: network || null,
              uniqueId: uniqueId, // Add this new property
            };
          });
          setCurrencyOptions(options);
        } else {
          toast({ title: "Error", description: "Invalid currency data" });
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        toast({ title: "Error", description: "Could not load currencies" });
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchCurrencies();
    }
  }, [open]);

  const filteredOptions = currencyOptions.filter(
    (coin) =>
      coin.name.includes(searchTerm.toLowerCase()) ||
      coin.label.includes(searchTerm.toUpperCase()),
  );

  // Sort options: popular coins first, then alphabetically
  const sortedOptions = [...filteredOptions].sort((a, b) => {
    // Popular coins first
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    // Then alphabetically
    return a.label.localeCompare(b.label);
  });

  const handleCreatePayment = async () => {
    if (!selectedCoin) {
      toast({ title: "Error", description: "Please select a currency." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, coin: selectedCoin }),
      });

      const data = await res.json();
      if (data.success && data.paymentData) {
        setPaymentData(data.paymentData);
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: "Payment Error",
          description: data.error
            ? JSON.stringify(data.error)
            : "Could not create payment. Please try again.",
        });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      toast({
        title: "Error",
        description: "Failed to initiate crypto payment.",
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedCoin(null);
    setPaymentData(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center gap-2">
          <Button className="py-4">Pay with Crypto</Button>
          <p className="text-sm">Powered by NowPayments</p>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Select Payment Method
          </DialogTitle>
        </DialogHeader>

        {!paymentData ? (
          <div className="space-y-4 text-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-600 bg-slate-700 pl-9"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
              </div>
            ) : (
              <>
                <RadioGroup
                  value={selectedCoin || ""}
                  onValueChange={setSelectedCoin}
                  className="flex max-h-[400px] flex-col gap-2 overflow-y-auto py-2 px-6"
                >
                  {sortedOptions.map((coin) => (
                    <div
                      key={coin.uniqueId}
                      className={`flex cursor-pointer items-center space-x-3 rounded-lg p-3 ${
                        selectedCoin === coin.name
                          ? "border border-green-600 bg-green-800"
                          : "hover:bg-slate-650 bg-slate-700"
                      } ${coin.popular ? "ring-1 ring-green-500" : ""} `}
                      onClick={() => setSelectedCoin(coin.name)}
                    >
                      <RadioGroupItem
                        value={coin.name}
                        id={coin.uniqueId}
                        className="sr-only"
                      />
                      <Image
                        src={coin.icon}
                        alt={coin.label}
                        width={24}
                        height={24}
                        className="h-8 w-8"
                        onError={(e) => {
                          e.currentTarget.src = "/crypto-icons/default.svg";
                          console.log(
                            `Failed to load icon for ${coin.name}: ${coin.icon}`,
                          );
                        }}
                      />
                      <div className="flex flex-grow flex-col">
                        <Label htmlFor={coin.name} className="font-medium">
                          {coin.label}
                        </Label>
                        {coin.network && (
                          <span className="text-xs text-gray-400">
                            {coin.network} Network
                          </span>
                        )}
                      </div>
                      {coin.popular && (
                        <span className="rounded-full bg-green-800 px-2 py-1 text-xs text-slate-50">
                          Popular
                        </span>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {sortedOptions.length === 0 && (
                  <p className="py-4 text-center text-gray-400">
                    No cryptocurrencies found matching your search.
                  </p>
                )}

                <Button
                  onClick={handleCreatePayment}
                  className="w-full bg-green-600 py-5 font-medium hover:bg-green-700"
                  disabled={!selectedCoin || loading}
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                </Button>
              </>
            )}
          </div>
        ) : (
          <PaymentDetails
            userId={user.id}
            coin={selectedCoin || ""}
            paymentId={paymentData.paymentId}
            address={paymentData.address}
            amount={paymentData.amount}
            currency={paymentData.currency}
            expiresAt={paymentData.expiresAt}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
