import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Briefcase,
  MoreHorizontal,
  Star,
  XCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  shortlisted: "bg-purple-100 text-purple-800 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200"
};

const ApplicationCard = ({ application, isSelected, onSelect, onStatusUpdate, isBulkSelected, onBulkSelectChange }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:border-gray-300'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
              className="mt-1"
              checked={isBulkSelected}
              onCheckedChange={() => onBulkSelectChange(application.id)}
          />
          <div className="flex-1 cursor-pointer" onClick={() => onSelect(application)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                    {getInitials(application.student_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {application.student_name}
                    </h3>
                    <Badge 
                      className={`text-xs ${statusColors[application.status]} border`}
                    >
                      {application.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">{application.position_title}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{application.student_email}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mt-1" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusUpdate(application.id, 'reviewing')}>Mark as Reviewing</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(application.id, 'interviewed')}>Mark as Interviewed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(application.id, 'accepted')}>Accept</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pl-14">
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onStatusUpdate(application.id, 'shortlisted'); }}>
                    <Star className="w-3 h-3 mr-2" /> Shortlist
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={(e) => { e.stopPropagation(); onStatusUpdate(application.id, 'rejected'); }}>
                    <XCircle className="w-3 h-3 mr-2" /> Reject
                </Button>
            </div>
            <div className="text-xs text-gray-500">
                Applied: {format(new Date(application.applied_date || application.created_date), 'MMM d, yyyy')}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ApplicationList({ 
  applications, 
  isLoading, 
  onSelectApplication, 
  onStatusUpdate,
  selectedApplication,
  selectedIds,
  onSelectionChange,
  onSelectAll
}) {
  if (isLoading && applications.length === 0) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-5 h-5 mt-1" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </CardContent>
      </Card>
    );
  }

  const areAllSelected = applications.length > 0 && selectedIds.length === applications.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-3 flex items-center">
          <Checkbox
            id="select-all"
            checked={areAllSelected}
            onCheckedChange={onSelectAll}
            disabled={applications.length === 0}
          />
          <label htmlFor="select-all" className="ml-3 font-medium text-sm text-gray-700 cursor-pointer">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All on this Page'}
          </label>
        </CardContent>
      </Card>
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isSelected={selectedApplication?.id === application.id}
          onSelect={onSelectApplication}
          onStatusUpdate={onStatusUpdate}
          isBulkSelected={selectedIds.includes(application.id)}
          onBulkSelectChange={onSelectionChange}
        />
      ))}
    </div>
  );
}