'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false
  })

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
              className="w-4 h-4"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Email Updates</span>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => setSettings(prev => ({ ...prev, emailUpdates: e.target.checked }))}
              className="w-4 h-4"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings(prev => ({ ...prev, darkMode: e.target.checked }))}
              className="w-4 h-4"
            />
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}




