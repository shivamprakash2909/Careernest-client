import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    sound: true,
    email: true,
    push: true,
    jobMatches: true,
    applicationUpdates: true,
    interviews: true,
    reminders: true,
    marketing: false
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleToggleAll = (enabled) => {
    const newSettings = {
      ...settings,
      enabled,
      sound: enabled ? settings.sound : false,
      email: enabled ? settings.email : false,
      push: enabled ? settings.push : false,
      jobMatches: enabled ? settings.jobMatches : false,
      applicationUpdates: enabled ? settings.applicationUpdates : false,
      interviews: enabled ? settings.interviews : false,
      reminders: enabled ? settings.reminders : false,
      marketing: enabled ? settings.marketing : false
    };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notification Settings"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </DialogTitle>
          <DialogDescription>
            Customize how you receive notifications from CareerNest
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.enabled ? (
                <Bell className="w-5 h-5 text-blue-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <Label className="text-sm font-medium">All Notifications</Label>
                <p className="text-xs text-gray-500">
                  {settings.enabled ? 'Notifications are enabled' : 'Notifications are disabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={handleToggleAll}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Notification Methods */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Notification Methods</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.sound ? (
                        <Volume2 className="w-4 h-4 text-blue-600" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                      <Label className="text-sm">Sound</Label>
                    </div>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(value) => updateSetting('sound', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">Email</Badge>
                      <Label className="text-sm">Email Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.email}
                      onCheckedChange={(value) => updateSetting('email', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">Push</Badge>
                      <Label className="text-sm">Push Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.push}
                      onCheckedChange={(value) => updateSetting('push', value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Notification Types</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💼</span>
                      <div>
                        <Label className="text-sm">Job Matches</Label>
                        <p className="text-xs text-gray-500">New jobs matching your skills</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.jobMatches}
                      onCheckedChange={(value) => updateSetting('jobMatches', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📝</span>
                      <div>
                        <Label className="text-sm">Application Updates</Label>
                        <p className="text-xs text-gray-500">Status changes on your applications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.applicationUpdates}
                      onCheckedChange={(value) => updateSetting('applicationUpdates', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📅</span>
                      <div>
                        <Label className="text-sm">Interviews</Label>
                        <p className="text-xs text-gray-500">Interview schedules and updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.interviews}
                      onCheckedChange={(value) => updateSetting('interviews', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">⏰</span>
                      <div>
                        <Label className="text-sm">Reminders</Label>
                        <p className="text-xs text-gray-500">Profile updates and deadlines</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.reminders}
                      onCheckedChange={(value) => updateSetting('reminders', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📢</span>
                      <div>
                        <Label className="text-sm">Marketing</Label>
                        <p className="text-xs text-gray-500">Promotional content and updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.marketing}
                      onCheckedChange={(value) => updateSetting('marketing', value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;
