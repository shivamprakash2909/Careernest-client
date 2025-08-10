import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle, Users, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: "all", name: "All FAQs", icon: HelpCircle },
    { id: "students", name: "For Students", icon: Users },
    { id: "recruiters", name: "For Recruiters", icon: Briefcase },
  ];

  const faqs = [
    {
      id: 1,
      category: "students",
      question: "What is Career Nest for?",
      answer:
        "CareerNest is designed to connect students, recent graduates, or job seekers or intership seekers with recruiters. It serves as bridge between individuals looking to gain practical experience and companies seeking fresh talent. Through the help of CareerNest students can apply for internships and at the same time, companies can post internship openings, review applicant profiles and manage recruitment process efficiently. Overall, it simplifies and streamlines the way internships are found and filled.",
    },
    {
      id: 2,
      category: "students",
      question: "How do I create a student account on CareerNest?",
      answer:
        "Creating a student account is simple! follow the steps: Click on 'Student Sign In' in the header, then select 'Create Account'. Fill in your details including your educational background, skills, and preferences. Make sure to upload a professional resume to increase your chances of getting noticed by recruiters.",
    },
    {
      id: 3,
      category: "recruiters",
      question: "How do I remove a job or internship posting?",
      answer:
        "To remove the posting on CareerNest, simply log in to your dashboard. FRom there, go to section where your active listings are displayed. SElect posting you want to remove and you'll find an option to delete. Detleting a post will permanently remove it.If you face any issues or need help removing a listing, our support team is always available to assist you.",
    },
    {
      id: 4,
      category: "students",
      question: "Is CareerNest free for job or internship seekers?",
      answer:
        "Yes, CareerNest is completely free for all job and internship seekers. Our goal is to make career opportunities accessible to everyone, regardless of their background or financial situation. You can explore listings, applying for internships or jobs and access resources without paying any fees. We believe that finding the right opportunity should never come at a cost and we're here to support you at every step of your career journey free of charge.",
    },
    {
      id: 5,
      category: "students",
      question: "How can I apply for internship?",
      answer:
        "Applying for internship at CareerNest is simple. You can try following points 1) Visit our official website and go to 'Internships' section. 2) Browse available roles that match your interest and skills. 3) Fill and Submit your application uploading your resume or relevant documents. 5) once submitted, our team will review your application and contact you via email if you are shortlisted.",
    },
    {
      id: 6,
      category: "recruiters",
      question: "Can I schedule interviews through the platform?",
      answer:
        "Yes, CareerNest allows you to schedule interviews directly through the platform. Once candidates apply for your internship or job listing, you can review their profiles and shortlist the ones who meet your requirements. From your dashboard, you can then send interview invitations, set preferred dates and times and communicate important details. This streamline hiring process and keeps everything organized in one place. If you need support while scheduling, our team is always ready to healp you navigate the process smoothly.",
    },
    {
      id: 7,
      category: "students",
      question: "Do I need prior experience?",
      answer:
        "No, you don't need any prior experience to apply for an internship at Career Nest. our internships are designed to support beginners, students and anyone looking to explore a new field. we understand that everyone starts somewhere and that's why we focus more on our interest, dedication and willingness to learn rather than what's already on your resume. At careerNest, we believe that potential matters more than past experience. You'll get the chance to work on meaningful tasks, learn from mentors and gain practical knowledge all from comfort. Whether you're just beginning your journey or stepping into something new, we welcome you to grow with us.",
    },
    {
      id: 8,
      category: "students",
      question: "How can I improve my chances of getting hired?",
      answer:
        "To improve your chances follow the list given below: 1) Complete your profile 100% with all details, 2) Upload a professional resume and photo, 3) Add relevant skills and certifications, 4) Write a compelling profile summary, 5) Apply to jobs that match your qualifications, and 6) Follow up on applications when appropriate.",
    },
    {
      id: 9,
      category: "students",
      question: "What types of jobs or internships are available in India?",
      answer:
        "CareerNest offers wide variety of internships and jobs opportunities across India. You can find roles in fields like digital marketing, content writing, graphic design, web development, social media management, data entry, customer support and more. Our aim is to provide flexible, skill-building opportunities that match your interests and help you grow professionally.",
    },
    {
      id: 10,
      category: "recruiters",
      question: "How do I reset my recruiter account password?",
      answer:
        "If you've forgotten your password or want to reset it, simply go to the CareerNest login page and click on 'Forgot Password'. Enter email address or phone number associated with your recruiter account and we'll send you password reset link. FOllow instructions in email to create new password. If you don't receive email within few minutes, be sure to check your spam or junk folder. for any issues, feel free to contact our support team we're here to help.",
    },
    {
      id: 11,
      category: "recruiters",
      question: "What support do you provide for new recruiters?",
      answer:
        "We're committed to making hiring process smooth and stress free especially for first time recruiters. Our platform is designed to be simple and intutice, but if you ever need help, our dedicated support team is here. Whether it's assistance with writing a compelling job description, improving your list, or understanding how to shortlist candidates effectively, we're here to help you in every step.",
    },
    {
      id: 12,
      category: "students",
      question: "Can I apply to multiple internships?",
      answer:
        "Yes, you absolutely can apply to multiple internships at CareerNest. we understand that everyone has diverse interests and skills and exploring different opportunities can help you discover what you're truly passionate about. Applying to more than one internshi not only broadens your chances of being selected but also allows you to gain experience in different fields or roles. At CareerNest, we courage you to take advantage of the variety of internships available so you can learn, grow, and build a stronger foundation for your career. Just make sure to manage your time well if you get selected for multiple internships, so you can give your best effort to each.",
    },
    {
      id: 13,
      category: "students",
      question: "How do I know if a company has viewed my application?",
      answer:
        "You'll receive email notifications when recruiters view your profile or application. You can also check your application status in your dashboard. We provide real-time updates on whether your application is pending, under review, or has been shortlisted.",
    },
    {
      id: 14,
      category: "recruiters",
      question: "Is there any charge to post internships?",
      answer:
        "No, there is no charge to post internship on CareerNest. We are committed to supporting both companies and aspiring professionals by providing a free and accessible platform. Employers can list internship opportunities at no cost, making it easy to connect with motivated candidates from across India. Our goal is to create meaningful opportunities without financial barriers for both recruiters and seekers.",
    },

    {
      id: 15,
      category: "students",
      question: "Are there internship opportunities available?",
      answer:
        "Absolutely! We have a dedicated internship section with opportunities across various fields. These include paid internships, remote work options, and programs with leading Indian companies. Many internships also offer the possibility of full-time conversion.",
    },
    {
      id: 16,
      category: "students",
      question: "How do I prepare for interviews?",
      answer:
        "Preparing for interviews starts with understanding the role you've applied for and the company offering it. Begin by carefully reading the job or internshi description so you're clear on skills and responsibilities involved. Review your resume, be ready to talk about your experiences, strengths and goals, and think of examples that show your abilities. Practice answering common interview questions, like 'Tell me about yourself' or' Why should we hire you?' in a confident, clear manner. Also research the company's background, values, and recent work so you can show genuine interest. Most importantly, stay clam, be honest, dress appropriately even for virtual interviews and remember that the interview is also a chance to learn if the opportunity is right fit. CareerNest is always here to support you with tios and resources to help you succeed.",
    },
    {
      id: 17,
      category: "recruiters",
      question: "How can I find the right candidates quickly?",
      answer:
        "To find the right candidates quickly on CareerNest, make sure your internship or job posting is detailed, clear and well-structured. Include specific requirements such as skills, experience level and responsibilities so only suitable applicants apply. Once your listing is live, you can easily browse through applications from your dashboard, filter candidates based on their qualifications and view their resumes. Our team is available to assist you in improving your listing for better reach and quality applicants.",
    },
    {
      id: 18,
      category: "recruiters",
      question: "Is the information of applicants kept confidential?",
      answer:
        "Yes, CareerNest takes the privacy and confidentially of all applicants very seriously. Any personal information, resumes or application details shared by candidates are on;y accessible to employers they apply to and are not shared with third parties without consent. We use secure systems to protect user data and ensure that it is handled responsibly and in accordance with privacy regulations. Our goal is to create a safe and trustworthy environment for both applicants and recruiters.",
    },
    {
      id: 19,
      category: "recruiters",
      question: "Who do I contact for technical support or other queries?",
      answer:
        "If you need technical support or have any questions about using CareerNest, our support team is here to help. You can reach out to us by using 'Contact Us' or by emailing us directly at support@careernest.in. Whether you're facing problem with logging in, need help for posting job or have querries about this page, we'll get back to you as soon as possible. Your experience matters to us and we're always ready to assist you.",
    },
    {
      id: 20,
      category: "students",
      question: "What if I face issue with company?",
      answer:
        "If you encounter any problems or concerns while working with company during your internship, CareerNest is here to support you. We encourage you to first try to communicate openly and professionally with the company or your internship supervisor to resolve the issue. However, if the problem persists or if you feel uncomfortable addressing it directly, you can always reach out to CareerNest support team. We take all concerns seriously and will do our best to assist you in finding asolution, whetjer that involves mediating the situation or guiding you on the next steps. Your learning experience and safety are very important to us and we're committed to ensuring you have a positive and productive internship.",
    },
    {
      id: 21,
      category: "recruiters",
      question: "How can my company start posting jobs on CareerNest?",
      answer:
        "If your company is interested in hiring, you can begin by registering as an recruiter on our platform. once registered, you'll gain access to your dashboard where you can create and publish internship or job listing by filling in details such as role description, requirements, duration, and application deadlines. Our team may review your post to ensure it meets our guidelines before it goes live. If you need any assistance during the process, our support team is always available to help. CareerNest is committed to connecting you with enthusiastic and capable candidates who are rady to learn and grow with your organization.",
    },
    {
      id: 22,
      category: "recruiters",
      question: "How do I review applications?",
      answer:
        "Our candidates start applying to your posted internships or jobs, you'll receive notifications and can access all applications through your dashboard. From there, you can view each applicant's profile, resume and any response they've provided during aplication process. If you need assistance navigating the dashboard or managing applications, our support tema is always here to guide you.",
    },
  ];

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Find answers to common questions about using CareerNest for your career journey
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Categories */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFaqs.length} of {faqs.length} questions
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <Card key={faq.id} className="border-l-4 border-l-blue-500">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Badge
                      variant="secondary"
                      className={`mt-1 ${
                        faq.category === "students" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {faq.category === "students" ? "Students" : "Recruiters"}
                    </Badge>
                    <CardTitle className="text-left text-lg font-semibold text-gray-900">{faq.question}</CardTitle>
                  </div>
                  {openItems[faq.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>

              {openItems[faq.id] && (
                <CardContent className="pt-0">
                  <div className="pl-20">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse different categories</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6">Our support team is here to help you succeed in your career journey</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@careernest.in"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Email Support
            </a>
            {/* <a 
              href="tel:+919876543210"
              className="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Call Us
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
