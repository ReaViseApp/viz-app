import { ScrollArea } from "@/components/ui/scroll-area"

export function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: January 2026</p>
      
      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Welcome to Viz.</h2>
          <p className="leading-relaxed text-foreground">
            These Terms of Service govern your use of Viz., a visual content sharing and curation platform. 
            By accessing or using Viz., you agree to be bound by these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-foreground">
            By creating an account or using Viz., you confirm that you are at least 13 years old and 
            agree to comply with these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">2. User Accounts</h2>
          <p className="leading-relaxed text-foreground mb-2">
            You are responsible for maintaining the confidentiality of your account credentials and 
            for all activities that occur under your account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Provide accurate and complete registration information</li>
            <li>Keep your password secure and confidential</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Not share your account with others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">3. Content Rights and Permissions</h2>
          <p className="leading-relaxed text-foreground mb-2">
            Viz. operates on a permission-based content sharing system:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>You retain all rights to content you create and upload</li>
            <li>By marking content as "Open to Repost," you grant other users permission to use those specific selections</li>
            <li>Content marked "Approval Required" requires your explicit permission before use</li>
            <li>You must respect the permission settings of all content on the platform</li>
            <li>Unauthorized use of content may result in account suspension</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">4. Content Guidelines</h2>
          <p className="leading-relaxed text-foreground mb-2">
            You agree not to post content that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Infringes on intellectual property rights</li>
            <li>Contains hate speech, harassment, or bullying</li>
            <li>Depicts violence, illegal activities, or adult content</li>
            <li>Contains spam, malware, or deceptive links</li>
            <li>Violates any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">5. Viz.Let Marketplace</h2>
          <p className="leading-relaxed text-foreground mb-2">
            If you choose to sell products through Viz.Let:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>You must accurately describe your products</li>
            <li>You are responsible for fulfilling orders and customer service</li>
            <li>You agree to our seller fees and payment processing terms</li>
            <li>You must have the right to sell all products listed</li>
            <li>You are responsible for complying with applicable tax laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">6. Termination</h2>
          <p className="leading-relaxed text-foreground">
            We reserve the right to suspend or terminate accounts that violate these Terms of Service 
            or for any other reason at our discretion. You may delete your account at any time 
            through your settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">7. Limitation of Liability</h2>
          <p className="leading-relaxed text-foreground">
            Viz. is provided "as is" without warranties of any kind. We are not liable for any 
            indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">8. Changes to Terms</h2>
          <p className="leading-relaxed text-foreground">
            We may modify these Terms of Service at any time. Continued use of Viz. after changes 
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">9. Contact</h2>
          <p className="leading-relaxed text-foreground">
            For questions about these Terms of Service, please contact us through the Help page.
          </p>
        </section>
      </div>
    </div>
  )
}

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: January 2026</p>
      
      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Your Privacy Matters</h2>
          <p className="leading-relaxed text-foreground">
            At Viz., we respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Information We Collect</h2>
          <p className="leading-relaxed text-foreground mb-2">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li><strong>Account Information:</strong> Username, email or phone number, password</li>
            <li><strong>Profile Information:</strong> Avatar, bio, preferences</li>
            <li><strong>Content:</strong> Posts, comments, likes, and Viz.List collections</li>
            <li><strong>Usage Data:</strong> Pages viewed, features used, interactions</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">How We Use Your Information</h2>
          <p className="leading-relaxed text-foreground mb-2">
            We use your information to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Provide and improve the Viz. platform</li>
            <li>Personalize your experience and content recommendations</li>
            <li>Process Viz.Let marketplace transactions</li>
            <li>Send notifications about activity on your account</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Information Sharing</h2>
          <p className="leading-relaxed text-foreground mb-2">
            We do not sell your personal information. We may share information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>With other users as part of the platform's social features</li>
            <li>With service providers who help us operate the platform</li>
            <li>When required by law or to protect rights and safety</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Your Privacy Controls</h2>
          <p className="leading-relaxed text-foreground mb-2">
            You have control over your information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Edit your profile and settings at any time</li>
            <li>Control who can see your Viz.List collections</li>
            <li>Delete your posts and comments</li>
            <li>Request a copy of your data</li>
            <li>Delete your account permanently</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Data Security</h2>
          <p className="leading-relaxed text-foreground">
            We use industry-standard security measures to protect your data, including encryption, 
            secure servers, and regular security audits. However, no method of transmission over 
            the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Cookies and Tracking</h2>
          <p className="leading-relaxed text-foreground">
            We use cookies and similar technologies to maintain your session, remember your 
            preferences, and analyze platform usage. You can control cookies through your 
            browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Children's Privacy</h2>
          <p className="leading-relaxed text-foreground">
            Viz. is not intended for children under 13. We do not knowingly collect information 
            from children under 13. If you believe we have collected such information, please 
            contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Changes to This Policy</h2>
          <p className="leading-relaxed text-foreground">
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes through the platform or by email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Contact Us</h2>
          <p className="leading-relaxed text-foreground">
            For questions about this Privacy Policy or to exercise your privacy rights, please 
            contact us through the Help page.
          </p>
        </section>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">About Viz.</h1>
      <p className="text-lg text-muted-foreground mb-8">Visual content curation, reimagined</p>
      
      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Our Mission</h2>
          <p className="leading-relaxed text-foreground text-lg">
            Viz. empowers creators to share their work while maintaining control over how it's used. 
            We believe in collaborative creativity with respect for original creators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">What Makes Viz. Different</h2>
          <p className="leading-relaxed text-foreground mb-4">
            Unlike traditional social platforms where content is either fully public or fully private, 
            Viz. lets creators define exactly which parts of their work can be reused and under what terms.
          </p>
          <div className="bg-muted/50 p-6 rounded-lg space-y-4">
            <div>
              <h3 className="font-bold text-primary mb-2">🎨 Granular Permissions</h3>
              <p className="text-sm text-foreground">
                Mark specific areas of your content as "Open to Repost" or "Approval Required"
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">📚 Viz.List Collections</h3>
              <p className="text-sm text-foreground">
                Curate visual inspiration from across the platform into personal collections
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">✨ Viz.Edit Editorials</h3>
              <p className="text-sm text-foreground">
                Create original compositions using approved content from your collections
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">🛍️ Viz.Let Marketplace</h3>
              <p className="text-sm text-foreground">
                Turn your popular creations into products and earn from your work
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Our Values</h2>
          <ul className="space-y-3 text-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Respect for Creators:</strong> Every creator deserves credit and control over their work</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Collaborative Creativity:</strong> The best art comes from building on each other's ideas</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Transparency:</strong> Clear permissions mean no confusion about what's allowed</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Community:</strong> A supportive space where creators can thrive together</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-primary">Join the Viz. Community</h2>
          <p className="leading-relaxed text-foreground">
            Whether you're a photographer, illustrator, designer, or just someone who loves beautiful 
            visuals, Viz. is your space to share, discover, and create. Join thousands of creators 
            building something new together.
          </p>
        </section>
      </div>
    </div>
  )
}

export function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Help & FAQ</h1>
      <p className="text-sm text-muted-foreground mb-8">Common questions about using Viz.</p>
      
      <div className="space-y-6">
        <section className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-primary">Getting Started</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-foreground mb-1">How do I create an account?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click "Sign Up for Viz." in the header, choose email or phone registration, create a username, 
                and agree to our terms. You'll get a unique Viz.Biz ID for selling features.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">What's the difference between Viz.It, Viz.List, and Viz.Edit?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Viz.It:</strong> Create and upload your own content<br/>
                <strong>Viz.List:</strong> Save selections from others' content to your collection<br/>
                <strong>Viz.Edit:</strong> Create editorials using items from your Viz.List
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-primary">Content Permissions</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-foreground mb-1">What does "Open to Repost" mean?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Content marked with a mint green border is "Open to Repost" - you can add it to your 
                Viz.List and use it in editorials without waiting for approval.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">What does "Approval Required" mean?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Content marked with a peach border requires the creator's permission. When you try to 
                Viz.List it, an approval request is sent. The creator can approve or decline.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">How do I handle approval requests?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Go to "Approval Status" in the sidebar. You'll see "Incoming Requests" (others requesting 
                your content) and "My Requests" (your requests to others). Approve or decline as you wish.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-primary">Creating Content</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-foreground mb-1">How do I upload content?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click "Viz.It" → "Take/Upload" → capture or upload media → draw selection areas → 
                set permissions (mint or peach) → add title and hashtags → publish.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">How do I create an editorial?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click "Viz.It" → "From Viz.List" → select approved items from your collection → 
                use the canvas editor to compose your editorial → add pages, text, shapes → publish.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">Can I edit or delete my posts?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Yes. Go to your profile, find the post, click the three-dot menu, and choose "Edit" or "Delete."
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-primary">Viz.Let Marketplace</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-foreground mb-1">How do I sell products?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Go to your profile → MyViz → select a Viz.Listable → click "Viz.Let?" → 
                fill out product details → upload at least 5 photos → set delivery options → publish.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">How do I buy products?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Browse Viz.Let → click a product → review details → add shipping address and payment 
                method in settings → click "Buy Now" or "Add to Cart."
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">What are the seller fees?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Every user gets a 1-year free trial for selling. After that, check your Viz.Biz ID 
                settings for current pricing.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-primary">Account & Settings</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-foreground mb-1">How do I change my password?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click your avatar → Settings → Security → Change Password
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">How do I delete my account?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click your avatar → Settings → Account → Delete Account. This action is permanent.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-1">How do I report inappropriate content?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Click the three-dot menu on any post → "Report" → select a reason. We review all reports.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6 bg-muted/30">
          <h3 className="text-lg font-bold mb-2 text-primary">Still Need Help?</h3>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            If you can't find the answer you're looking for, contact our support team through the Contact page.
          </p>
        </section>
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Contact Us</h1>
      <p className="text-sm text-muted-foreground mb-8">We'd love to hear from you</p>
      
      <div className="space-y-6">
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-primary">Get in Touch</h3>
          <p className="text-sm text-foreground leading-relaxed mb-6">
            Have a question, suggestion, or need support? Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us more..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-accent transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-6">
            <h4 className="font-bold mb-2 text-primary">Support Email</h4>
            <p className="text-sm text-muted-foreground">support@viz.app</p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="font-bold mb-2 text-primary">Business Inquiries</h4>
            <p className="text-sm text-muted-foreground">business@viz.app</p>
          </div>
        </div>
      </div>
    </div>
  )
}
