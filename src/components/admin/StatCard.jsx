import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 py-2 sm:py-3">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">{title}</CardTitle>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color} flex-shrink-0`} />
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}