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

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => handleProviderChange(providerStatus.activeProvider === "gemini" ? "groq" : "gemini")}
              disabled={isProviderSaving}
              aria-label="Toggle AI Provider"
              title={providerStatus.activeProvider === "gemini" ? "Gemini Active" : "Groq Active"}
              className="relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-white/15 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-slate-300 shadow-sm ring-0 transition duration-200 ease-in-out ${
                  providerStatus.activeProvider === "groq" ? "translate-x-2.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
