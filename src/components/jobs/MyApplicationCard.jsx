import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "reviewed":
      return "bg-blue-100 text-blue-800";
    case "shortlisted":
      return "bg-purple-100 text-purple-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "hired":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MyApplicationCard({ app }) {
  if (!app) return null;

  const getTitle = () => {
    return app.title || 'Position Title Not Available';
  };

  const getPosition = () => {
    return app.position || (app.application_type === 'job' ? 'Job Position' : 'Internship Position');
  };

  const getDetails = () => {
    if (app.application_type === 'job' && app.salary) {
      return `Salary: ${app.salary}`;
    }
    if (app.application_type === 'internship') {
      return [
        app.stipend && `Stipend: ${app.stipend}`,
        app.duration && `Duration: ${app.duration}`
      ].filter(Boolean).join(' • ');
    }
    return '';
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={app.company_logo || "/vite.svg"}
            alt="Company Logo"
            className="w-14 h-14 object-cover rounded-md border"
            onError={(e) => e.target.src = "/vite.svg"}
          />
          <div>
            <CardTitle className="text-lg font-semibold text-blue-900">
              {getTitle()}
            </CardTitle>
            <p className="text-sm text-gray-600">{getPosition()}</p>
            <p className="text-sm text-muted-foreground">{app.company_name || 'Company Name Not Available'}</p>
            <p className="text-sm text-gray-500 mt-1">{app.location}</p>
            {getDetails() && (
              <p className="text-sm text-gray-500">{getDetails()}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{app.application_type === 'job' ? 'Job' : 'Internship'}</Badge>
              <Badge className={getStatusColor(app.status || 'pending')}>{app.status || 'Pending'}</Badge>
            </div>
            {app.created_date && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" /> Applied on: {formatDate(app.created_date)}
              </p>
            )}
          </div>
        </div>

        <div className="sm:ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
            {app.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p>
            <strong>Applicant:</strong> {app.applicant_name}
          </p>
          <p>
            <strong>Email:</strong> {app.applicant_email}
          </p>
          {app.phone && (
            <p>
              <strong>Phone:</strong> {app.phone}
            </p>
          )}
          {app.experience && (
            <p>
              <strong>Experience:</strong> {app.experience} yrs
            </p>
          )}
        </div>

        {app.cover_letter && (
          <div>
            <p className="text-sm font-medium text-gray-800 mt-2 mb-1">Cover Letter:</p>
            <p className="whitespace-pre-line border-l-4 pl-3 border-blue-200 italic text-gray-600 bg-blue-50 rounded-md py-2">
              {app.cover_letter}
            </p>
          </div>
        )}

        {app.resume_url ? (
          <a
            href={app.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 font-medium hover:underline mt-3"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Resume
          </a>
        ) : (
          <p className="text-sm text-gray-500 italic">No resume uploaded.</p>
        )}
      </CardContent>
    </Card>
  );
}
