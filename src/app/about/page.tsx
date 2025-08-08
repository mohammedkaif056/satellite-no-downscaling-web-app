import { FullwidthIconNavbar } from '@/components/navbars/fullwidth-icon-navbar'
import { NewsletterFooter } from '@/components/footers/newsletter-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Home, Upload, Map, BarChart3, BookOpen, Info, Shield, Mail, MapPin, Phone, ExternalLink, Users, Award } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
}

interface TeamMember {
  name: string
  title: string
  description: string
  expertise: string[]
  institution: string
}

export default function AboutPage() {
  const user: UserProfile = {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@env-lab.org',
    role: 'admin'
  }

  const navigationMenu = [
    {
      title: "Home",
      url: "/",
      icon: <Home className="size-5 shrink-0" />
    },
    {
      title: "Upload & Predict",
      url: "/upload",
      icon: <Upload className="size-5 shrink-0" />
    },
    {
      title: "Map Viewer",
      url: "/map",
      icon: <Map className="size-5 shrink-0" />
    },
    {
      title: "Validation",
      url: "/validation",
      icon: <BarChart3 className="size-5 shrink-0" />
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: <BookOpen className="size-5 shrink-0" />
    },
    {
      title: "About",
      url: "/about",
      icon: <Info className="size-5 shrink-0" />
    },
    {
      title: "Admin Panel",
      url: "/admin",
      icon: <Shield className="size-5 shrink-0" />,
      adminOnly: true
    }
  ]

  const teamMembers: TeamMember[] = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Principal Investigator',
      description: 'Leading expert in atmospheric modeling and satellite remote sensing with over 15 years of experience in NO₂ monitoring.',
      expertise: ['Atmospheric Modeling', 'Remote Sensing', 'Air Quality', 'Machine Learning'],
      institution: 'Environmental Science Institute'
    },
    {
      name: 'Dr. Michael Rodriguez',
      title: 'Senior Research Scientist',
      description: 'Specialist in machine learning applications for environmental data with focus on deep learning models.',
      expertise: ['Deep Learning', 'Computer Vision', 'Data Science', 'Python Development'],
      institution: 'AI Research Lab'
    },
    {
      name: 'Dr. Emily Watson',
      title: 'Atmospheric Scientist',
      description: 'Expert in atmospheric chemistry and NO₂ dynamics with extensive field experience in validation studies.',
      expertise: ['Atmospheric Chemistry', 'Field Measurements', 'Data Validation', 'Statistical Analysis'],
      institution: 'Climate Research Center'
    },
    {
      name: 'Alex Kumar',
      title: 'Software Engineer',
      description: 'Full-stack developer responsible for the web platform architecture and ML model integration.',
      expertise: ['Web Development', 'API Design', 'Cloud Computing', 'DevOps'],
      institution: 'Tech Solutions Group'
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <FullwidthIconNavbar
        menu={navigationMenu}
        user={user}
        activeJobsCount={2}
      />
      
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">About</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Advancing air quality monitoring through innovative AI-driven downscaling of satellite NO₂ observations
          </p>
        </div>
        
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  We develop cutting-edge machine learning models to enhance the spatial resolution 
                  of satellite-based nitrogen dioxide (NO₂) measurements, bridging the gap between 
                  coarse satellite observations and fine-scale air quality monitoring needs.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our work enables researchers, policymakers, and environmental agencies to access 
                  high-resolution NO₂ data for urban planning, health studies, and emission monitoring.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">Research Excellence</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Open Collaboration</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🛰️</div>
                  <p className="text-muted-foreground font-medium">Satellite Data Enhancement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium">{member.title}</p>
                    <p className="text-sm text-muted-foreground">{member.institution}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {member.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Contact Us</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
              <p className="text-muted-foreground mb-6">
                Have questions about our research or interested in collaboration? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">research@no2downscaling.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-muted-foreground">
                    <p>Environmental Science Institute</p>
                    <p>123 Research Drive</p>
                    <p>University City, ST 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Send a Message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
      
      <NewsletterFooter />
    </main>
  )
}