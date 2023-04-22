import { useState, useEffect } from "react";

export default function useConfig() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchConfig() {
      const res = await window.api.initializeApp();
      if (res) setConfig(res);
      setLoading(false);
    }

    fetchConfig();
  }, []);

  return { config, loading };
}
