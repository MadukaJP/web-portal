import { useState } from 'react'
import { AppShell } from '#/components/AppShell'
import { createApiKey } from '#/functions/auth'
import { Button } from '#/components/ui/button'
import { Key, Copy, Check, AlertCircle, ShieldAlert } from 'lucide-react'

export function ApiKeyPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError(null)
      setCopied(false)
      const key = await createApiKey()
      setApiKey(key)
    } catch (err: any) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to generate API key. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text', err)
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">API Key</h1>
            <p className="text-sm text-muted-foreground">
              Manage your credentials for programmatic access.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {!apiKey ? (
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-2">Developer Authentication</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                You can authenticate your API requests by adding your API key in the request headers. 
                Please note that generating a new API key will automatically <strong>invalidate and replace</strong> any key you previously created.
              </p>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg flex items-start gap-3 mb-6">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-400">
                  <p className="font-semibold">Security Warning</p>
                  <p className="mt-1 leading-relaxed">
                    For your security, API keys are only displayed <strong>once</strong>. If you navigate away or refresh the page, you will not be able to view the key again. Make sure to copy it immediately.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full sm:w-auto font-medium"
              >
                {loading ? 'Generating...' : 'Generate New API Key'}
              </Button>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm border-primary/50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              
              <h2 className="text-lg font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                API Key Generated Successfully
              </h2>
              
              <p className="text-sm text-muted-foreground mb-6">
                Copy this key now. It will not be shown again.
              </p>

              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-start gap-3 mb-6">
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive-foreground">
                  <p className="font-semibold text-destructive">Crucial Notice</p>
                  <p className="mt-1 leading-relaxed">
                    Once you close this view or leave this page, <strong>this API key cannot be retrieved</strong>. If lost, you will have to generate a new one, which will revoke access for this one.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    onClick={handleCopy}
                    className="w-full h-10 px-3 pr-10 text-sm font-mono bg-muted border border-input rounded-md select-all focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Key
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setApiKey(null)
                    setCopied(false)
                  }}
                >
                  Done, I have saved it
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
