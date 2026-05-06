import React, { useEffect, useState } from "react";
import api from "../api/axios";

const LLM_PROVIDERS = [
  { id: "gemini", label: "Gemini" },
  { id: "groq", label: "GroqCloud" },
];
function getProviderLabel(provider) {
  return LLM_PROVIDERS.find((item) => item.id === provider)?.label || "Gemini";
}

function Footer() {
  const [providerStatus, setProviderStatus] = useState({
    activeProvider: "gemini",
    configuredProviders: {},
    supportedProviders: LLM_PROVIDERS.map((provider) => provider.id),
  });
  const [providerMessage, setProviderMessage] = useState("");
  const [isProviderSaving, setIsProviderSaving] = useState(false);

  useEffect(() => {
    const loadProviderStatus = async () => {
      try {
        const res = await api.get("/bias/provider");
        setProviderStatus({
          activeProvider: res.data?.activeProvider || "gemini",
          configuredProviders: res.data?.configuredProviders || {},
          supportedProviders:
            res.data?.supportedProviders || LLM_PROVIDERS.map((provider) => provider.id),
        });
      } catch (error) {
        console.error("Error fetching LLM provider:", error);
        setProviderMessage("Provider status unavailable");
      }
    };

    loadProviderStatus();
  }, []);

  const handleProviderChange = async (provider) => {
    if (provider === providerStatus.activeProvider || isProviderSaving) {
      return;
    }

    setIsProviderSaving(true);
    setProviderMessage("");

    try {
      const res = await api.put("/bias/provider", { provider });
      const nextStatus = {
        activeProvider: res.data?.activeProvider || provider,
        configuredProviders: res.data?.configuredProviders || {},
        supportedProviders: res.data?.supportedProviders || LLM_PROVIDERS.map((item) => item.id),
      };
      const providerLabel = getProviderLabel(provider);
      setProviderStatus(nextStatus);
      setProviderMessage(
        nextStatus.configuredProviders?.[provider]
          ? `${providerLabel} selected`
          : `${providerLabel} selected, API key missing`
      );
    } catch (error) {
      console.error("Error updating LLM provider:", error);
      setProviderMessage("Could not update provider");
    } finally {
      setIsProviderSaving(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.25fr_repeat(3,0.75fr)] lg:px-10">
        <div>
          <div className="text-2xl font-black tracking-[0.22em] text-white">INSIGHT AI</div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Discover balanced reporting, compare perspectives, and stay closer to the stories shaping the world.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Product</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>Features</li>
            <li>News</li>
            <li>Bias Analysis</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Company</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Social</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>© 2026 InSight AI</span>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="grid grid-cols-2 gap-2 rounded-[1.15rem] border border-white/15 bg-white/10 p-1">
              {LLM_PROVIDERS.map((provider) => {
                const isActive = providerStatus.activeProvider === provider.id;
                const isConfigured = Boolean(providerStatus.configuredProviders?.[provider.id]);

                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderChange(provider.id)}
                    disabled={isProviderSaving}
                    aria-pressed={isActive}
                    title={
                      isConfigured
                        ? `${provider.label} API key configured`
                        : `${provider.label} API key missing`
                    }
                    className={`h-10 min-w-24 rounded-[0.85rem] px-4 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#fbf8f1] text-[#2f465e] shadow-[0_8px_18px_rgba(0,0,0,0.24)]"
                        : "text-slate-200 hover:bg-white/10"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {provider.label}
                  </button>
                );
              })}
            </div>
            <p className="min-h-5 text-xs font-medium text-slate-300">
              {providerMessage ||
                `${getProviderLabel(providerStatus.activeProvider)} powers new bias runs`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
