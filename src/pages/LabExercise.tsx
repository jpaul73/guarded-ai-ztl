import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield, Database, Lock, Fish, ChevronRight, RotateCcw, Eye, EyeOff, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/guarded-ai-logo.png";
import { practicalLabsData } from "@/data/practicalLabs";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LabData {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  introduction: string;
  questions: Question[];
}
 const labsData: Record<string, LabData> = {
  idor: {
    id: "idor",
    title: "IDOR Vulnerabilities",
    description: "Learn about Insecure Direct Object References",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    introduction: "Insecure Direct Object Reference (IDOR) occurs when an application exposes internal object references (like database IDs) to users without proper authorization checks. Attackers can manipulate these references to access unauthorized data.",
    questions: [
      { id: 1, question: "You're viewing your profile at example.com/user/123. What should you try to test for IDOR?", options: ["Change the URL to example.com/user/124", "Add ?admin=true to the URL", "Delete cookies and refresh", "Change the page title"], correctAnswer: 0, explanation: "Changing the user ID in the URL is a classic IDOR test. If you can access another user's profile by changing 123 to 124, the application is vulnerable." },
      { id: 2, question: "An API endpoint returns user data at /api/users/5. How should the server prevent IDOR?", options: ["Hide the endpoint from documentation", "Use complex random IDs instead of sequential numbers", "Verify the requesting user has permission to access user 5's data", "Only allow GET requests"], correctAnswer: 2, explanation: "Authorization checks are essential. The server must verify that the logged-in user has permission to access the requested resource, regardless of the ID format." },
      { id: 3, question: "Which of these is the BEST defense against IDOR vulnerabilities?", options: ["Using HTTPS", "Implementing proper access control checks on every request", "Hiding object IDs from the URL", "Rate limiting API requests"], correctAnswer: 1, explanation: "Access control checks on every request ensure that users can only access resources they're authorized to view, regardless of how they obtained the reference." },
      { id: 4, question: "A document download link is /download?file=report_2024.pdf. What's the IDOR risk?", options: ["The PDF might contain malware", "An attacker could guess other filenames and download unauthorized documents", "The link might expire", "The file might be too large"], correctAnswer: 1, explanation: "If there's no authorization check, an attacker could modify the filename to access other documents like 'confidential_report.pdf' or 'employee_salaries.pdf'." },
      { id: 5, question: "What is the primary difference between authentication and authorization in the context of IDOR?", options: ["They are the same thing", "Authentication verifies WHO you are; authorization verifies WHAT you can access", "Authorization requires a stronger password", "Authentication is enough to prevent IDOR"], correctAnswer: 1, explanation: "Authentication proves you are who you claim to be, but authorization determines what you're allowed to do. IDOR happens when authentication is present but authorization is missing." },
      { id: 6, question: "A URL uses base64-encoded IDs: /profile?user=YWxpY2U=. Is this secure against IDOR?", options: ["Yes, base64 encoding is cryptographically secure", "No, base64 is easily reversible and doesn't prevent IDOR", "It depends on the server-side checks", "Only if combined with HTTPS"], correctAnswer: 2, explanation: "Base64 encoding doesn't provide security - it's just encoding. The real protection comes from server-side authorization checks. Attackers can decode base64 to find other user IDs." },
      { id: 7, question: "Which of these API responses would be MOST vulnerable to IDOR enumeration attacks?", options: ["Returns 404 for unauthorized resources", "Returns 403 Forbidden for unauthorized access", "Returns 200 OK with empty data for unauthorized resources", "Returns a cryptic error message"], correctAnswer: 2, explanation: "Returning 200 with empty data doesn't indicate whether the resource exists, allowing attackers to enumerate and map out all valid IDs. Proper responses should return 403 Forbidden for unauthorized access." },
      { id: 8, question: "In a multi-tenant SaaS application, what additional IDOR risk exists?", options: ["No additional risk, IDOR is the same everywhere", "Users could access data from other tenants/organizations", "Only database administrators can cause IDOR", "Multi-tenancy automatically prevents IDOR"], correctAnswer: 1, explanation: "Multi-tenant applications have heightened IDOR risks because data from different organizations is in the same system. A single missing check could expose an entire organization's data to competitors." },
      { id: 9, question: "API versioning is present: /api/v1/users/5 and /api/v2/users/5. What should be checked for IDOR?", options: ["Only check the v1 endpoint", "Only check the v2 endpoint", "Check BOTH endpoints for authorization", "Versioning prevents IDOR"], correctAnswer: 2, explanation: "Developers often implement security in one API version but forget to apply the same checks in other versions. All API endpoints should enforce the same authorization rules." },
      { id: 10, question: "What is a UUID and how does it relate to IDOR prevention?", options: ["Universal User Database - a replacement for passwords", "Universally Unique Identifier - makes IDs unpredictable, complicating enumeration", "Unique User ID - proves the user is unique", "Unified User Information - a database format"], correctAnswer: 1, explanation: "UUIDs (like 550e8400-e29b-41d4-a716-446655440000) are cryptographically random and make sequential enumeration much harder, though they don't eliminate IDOR - authorization checks are still essential." },
      { id: 11, question: "A website uses incrementing invoice IDs. You find invoices at /invoices/1001, /invoices/1002, etc. How would you test for IDOR?", options: ["Try /invoices/9999", "Try /invoices/1003 and check if it's from another customer", "Change the URL to HTTPS", "Test is impossible"], correctAnswer: 1, explanation: "Systematically testing sequential IDs (1003, 1004, 1005, etc.) can reveal other customers' invoices if there's no authorization check. Document which invoices you can access vs. which ones you own." },
      { id: 12, question: "What logging would help detect IDOR attacks?", options: ["No logging needed", "Log all data access with user IDs and timestamps", "Log only successful transactions", "Logging prevents IDOR"], correctAnswer: 1, explanation: "Proper logging of who accessed what data when enables detection of IDOR exploitation. Unusual access patterns (one user accessing many different account IDs) should trigger alerts." },
      { id: 13, question: "In a photo sharing app, user photos are at /photos/12345. What's the IDOR vulnerability here?", options: ["Photos shouldn't use numbers", "Attackers can enumerate different photo IDs to view private photos", "The vulnerability only exists if photos are in URLs", "This is perfectly secure"], correctAnswer: 1, explanation: "If there's no authorization check, an attacker can guess sequential photo IDs to view other users' photos, including private ones not shared publicly." },
      { id: 14, question: "How does IDOR differ from CSRF (Cross-Site Request Forgery)?", options: ["They are the same vulnerability", "IDOR is about authorization; CSRF is about forging requests from authenticated users", "CSRF affects IDOR vulnerabilities", "IDOR is outdated"], correctAnswer: 1, explanation: "IDOR = accessing unauthorized resources. CSRF = tricking authenticated users into making unintended requests. Both are serious but different: IDOR is reading data, CSRF is making actions." },
      { id: 15, question: "What should a secure API endpoint look like for accessing user data?", options: ["GET /api/users/5 (no checks needed)", "GET /api/users/5 with server-side authorization: verify req.user.id == resource.owner_id", "Hide the user ID completely from URLs", "Use POST instead of GET"], correctAnswer: 1, explanation: "Secure endpoints must always verify that the authenticated user has permission to access the specific resource. This happens server-side where it cannot be bypassed." }
    ]
  },
  "sql-injection": {
    id: "sql-injection",
    title: "SQL Injection",
    description: "Understand database attack techniques",
    icon: Database,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    introduction: "SQL Injection is a code injection technique that exploits vulnerabilities in applications that construct SQL queries from user input. Attackers can manipulate queries to access, modify, or delete data they shouldn't have access to.",
    questions: [
      { id: 1, question: "A login form sends: SELECT * FROM users WHERE username='$input'. What input could bypass authentication?", options: ["admin", "' OR '1'='1", "<script>alert('hack')</script>", "DROP TABLE users"], correctAnswer: 1, explanation: "' OR '1'='1 closes the username string and adds a condition that's always true, potentially returning all users and bypassing the password check." },
      { id: 2, question: "Which defense technique is MOST effective against SQL injection?", options: ["Input length validation", "Removing special characters", "Parameterized queries (prepared statements)", "Encrypting the database"], correctAnswer: 2, explanation: "Parameterized queries separate SQL code from data, making it impossible for user input to be interpreted as SQL commands. This is the gold standard for SQL injection prevention." },
      { id: 3, question: "A search feature uses: SELECT * FROM products WHERE name LIKE '%$search%'. What's the risk?", options: ["Search might be slow", "Results might be empty", "An attacker could inject SQL to extract other data", "The wildcard % might not work"], correctAnswer: 2, explanation: "An attacker could input: %' UNION SELECT username, password FROM users -- to extract user credentials alongside search results." },
      { id: 4, question: "What does the -- sequence do in SQL injection attacks?", options: ["Subtracts values", "Comments out the rest of the query", "Represents a null value", "Escapes special characters"], correctAnswer: 1, explanation: "-- starts a SQL comment, causing the database to ignore everything after it. This helps attackers craft valid SQL by commenting out the original query's remaining parts." },
      { id: 5, question: "What is the difference between error-based and blind SQL injection?", options: ["They are identical", "Error-based returns visible errors; blind gives no feedback but can still be exploited", "Blind is more secure", "Error-based doesn't work"], correctAnswer: 1, explanation: "Error-based shows database errors revealing information. Blind SQL injection gets no direct feedback but attackers use conditional logic and timing to extract data anyway." },
      { id: 6, question: "How would an attacker use a UNION-based attack?", options: ["By combining two SQL SELECT statements to extract data", "By deleting union membership records", "By joining tables", "It's not possible"], correctAnswer: 0, explanation: "UNION allows combining results from multiple SELECT statements. An attacker can append UNION SELECT to access unauthorized tables if columns match." },
      { id: 7, question: "In time-based blind SQL injection, what technique is used?", options: ["Measuring response time to infer true/false", "Using date functions to bypass security", "Timing out the database", "Delaying data updates"], correctAnswer: 0, explanation: "Time-based attacks use SLEEP() or BENCHMARK() functions. If a query is true, it executes a delay; if false, it responds immediately. Attackers measure response times to extract data." },
      { id: 8, question: "What does this payload do: ' UNION SELECT NULL, NULL, NULL--", options: ["Creates a new table", "Tests if UNION injection works by checking column count", "Deletes all data", "Logs out the user"], correctAnswer: 1, explanation: "This tests if the number of columns is correct. If it returns an error, the number of NULLs doesn't match the original query's column count." },
      { id: 9, question: "Which databases are vulnerable to SQL injection?", options: ["Only MySQL", "Only Oracle", "Only PostgreSQL", "All relational databases if vulnerable code exists"], correctAnswer: 3, explanation: "SQL injection affects any database that accepts dynamic SQL queries without proper parameterization: MySQL, PostgreSQL, Oracle, SQL Server, SQLite, etc." },
      { id: 10, question: "How can INFORMATION_SCHEMA be exploited?", options: ["It doesn't contain useful information", "Attackers can query table and column names to find data to extract", "It automatically prevents attacks", "It's only available to admins"], correctAnswer: 1, explanation: "INFORMATION_SCHEMA contains metadata about database structure. Attackers query it to find table names and column names: SELECT table_name FROM information_schema.tables" },
      { id: 11, question: "What is a second-order SQL injection?", options: ["Two SQL queries in one statement", "Injection that persists in database and executes later", "An attack that happens twice", "Injection in the second database"], correctAnswer: 1, explanation: "Second-order injection: data is injected, stored in the database safely, but later used unsafely in another query. The attack is delayed and harder to detect." },
      { id: 12, question: "How do input filters like removing quotes prevent SQL injection?", options: ["They completely prevent it", "They don't; attackers use hex encoding and other bypasses", "They only work for passwords", "Filters are perfect security"], correctAnswer: 1, explanation: "Filtering is unreliable. Attackers bypass filters using: hex encoding, comments, case variation, encoding, etc. Parameterized queries are the proper defense." },
      { id: 13, question: "What is out-of-band SQL injection?", options: ["Data exfiltration through alternate channels like DNS or HTTP requests", "Injection without using SQL", "A type of network attack", "Exfiltration doesn't work"], correctAnswer: 0, explanation: "Out-of-band extracts data through DNS lookups or HTTP requests instead of the application response. Example: SELECT * FROM users INTO OUTFILE or exfil via DNS." },
      { id: 14, question: "Why is prepared statement parameterization secure against SQL injection?", options: ["It removes SQL from the query", "It sends SQL structure and data separately; data cannot be interpreted as SQL code", "It encrypts the query", "It's not actually secure"], correctAnswer: 1, explanation: "Prepared statements: the SQL structure is defined first, then data is bound. The database knows data is data, not executable code, preventing injection." },
      { id: 15, question: "Which of these is a vulnerable pattern in Java?", options: ["String sql = \"SELECT * FROM users WHERE id = ?\"; PreparedStatement ps = conn.prepareStatement(sql); ps.setInt(1, userId);", "String sql = \"SELECT * FROM users WHERE id = \" + userId; Statement st = conn.createStatement(); st.execute(sql);", "Using Hibernate ORM with parameterized queries", "All parameterized approaches"], correctAnswer: 1, explanation: "String concatenation (vulnerable) vs parameterized PreparedStatement (secure). The second example is vulnerable because user input is directly concatenated into the SQL string." }
    ]
  },
  "access-control": {
    id: "access-control",
    title: "Access Control",
    description: "Master authorization security",
    icon: Lock,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    introduction: "Broken Access Control occurs when users can act outside their intended permissions. This includes accessing other users' data, performing unauthorized actions, or escalating privileges to admin-level access.",
    questions: [
      { id: 1, question: "A regular user discovers /admin/dashboard is accessible. What type of flaw is this?", options: ["SQL Injection", "Vertical privilege escalation", "Cross-site scripting", "Buffer overflow"], correctAnswer: 1, explanation: "Vertical privilege escalation occurs when a user gains access to functionality meant for higher-privilege users (like admins). The application failed to verify the user's role." },
      { id: 2, question: "Which access control model assigns permissions based on user roles (Admin, Editor, Viewer)?", options: ["Discretionary Access Control (DAC)", "Mandatory Access Control (MAC)", "Role-Based Access Control (RBAC)", "Attribute-Based Access Control (ABAC)"], correctAnswer: 2, explanation: "RBAC assigns permissions to roles rather than individual users. Users are then assigned roles, making permission management more scalable and organized." },
      { id: 3, question: "An API endpoint /api/deleteUser/456 only checks if the user is logged in. What's missing?", options: ["HTTPS encryption", "Request rate limiting", "Authorization check (can this user delete user 456?)", "Input validation"], correctAnswer: 2, explanation: "Authentication (who are you?) is different from authorization (what can you do?). The endpoint must verify the logged-in user has permission to delete the specific user." },
      { id: 4, question: "What's the principle of least privilege?", options: ["Give everyone admin access for convenience", "Grant only the minimum permissions needed to perform a task", "Remove all permissions by default", "Let users choose their own permissions"], correctAnswer: 1, explanation: "Least privilege means users should only have the exact permissions they need—nothing more. This limits the damage if an account is compromised." },
      { id: 5, question: "What is horizontal privilege escalation?", options: ["Gaining admin access from a regular account", "Accessing resources of users at the same privilege level", "Moving between servers", "Escalating database privileges"], correctAnswer: 1, explanation: "Horizontal escalation = accessing resources of peer users. Example: viewing another customer's data. Vertical escalation = accessing higher privilege features." },
      { id: 6, question: "How should access control be enforced?", options: ["Only on the client side with JavaScript", "Only on the server side", "On both client and server", "Through URL obfuscation"], correctAnswer: 1, explanation: "Client-side checks can be bypassed. All authorization decisions must be made server-side where users cannot tamper with the logic or bypass checks." },
      { id: 7, question: "What is a capability token or nonce?", options: ["A worthless security measure", "A token proving the holder can perform a specific action", "A type of password", "A database function"], correctAnswer: 1, explanation: "Capability tokens grant specific permissions (e.g., 'can view this document'). They can be short-lived and revoked, providing granular access control." },
      { id: 8, question: "In ABAC (Attribute-Based Access Control), what replaces simple role assignments?", options: ["Complex passwords", "Rules based on user attributes, resource attributes, and context", "Network IP addresses", "Device serial numbers"], correctAnswer: 1, explanation: "ABAC decisions are made using attributes like: department, location, time of day, data classification, user role, device type. More flexible than RBAC." },
      { id: 9, question: "What happens with insecure direct object references in access control?", options: ["Users can only access their own data", "Server crashes", "Attackers can access any object by modifying IDs in requests", "Data is automatically encrypted"], correctAnswer: 2, explanation: "IDOR = accessing unauthorized objects by modifying IDs. This is an access control failure where the system doesn't verify user permissions before granting access." },
      { id: 10, question: "How should sensitive operations be protected?", options: ["No special protection needed", "Only password protection", "Multi-factor authentication and re-verification", "Trusting the user"], correctAnswer: 2, explanation: "Sensitive operations (password change, fund transfers, permission changes) should require re-authentication and multi-factor verification even if the user is already logged in." },
      { id: 11, question: "What is the purpose of access control matrices?", options: ["Confusing security", "Documenting who can perform what actions on which resources", "Encrypting data", "Replacing passwords"], correctAnswer: 1, explanation: "Access control matrices document all resource-action-user combinations, helping identify gaps and inconsistencies in access control policies." },
      { id: 12, question: "How can you test if access control is properly implemented?", options: ["Ask the developer", "Assume it's correct", "Systematically test accessing resources as different user roles", "Wait for breaches"], correctAnswer: 2, explanation: "Security testing requires attempting to access resources with different accounts: admin, regular user, guest. Document what each role can/cannot access." },
      { id: 13, question: "What's the risk of using shared accounts?", options: ["No risk", "Cannot determine who performed actions", "Easier for multiple users", "Better password security"], correctAnswer: 1, explanation: "Shared accounts prevent audit trails and accountability. If a breach occurs, you can't determine who was responsible. Each user needs individual accounts." },
      { id: 14, question: "How should session management relate to access control?", options: ["Sessions aren't related to access control", "Session tokens should not grant any permissions", "Session management must enforce access control throughout the session lifetime", "Any session is equivalent"], correctAnswer: 2, explanation: "Access control must be enforced throughout the entire session, not just at login. Sessions can expire, permissions can change, and access must be re-verified for critical actions." },
      { id: 15, question: "What is privilege escalation and why is it dangerous?", options: ["Gaining higher permissions than intended; allows access to sensitive data/functions", "Increasing password complexity", "Upgrading software", "A positive security feature"], correctAnswer: 0, explanation: "Privilege escalation (horizontal or vertical) allows attackers to access unauthorized data or perform unauthorized actions. It's among the most critical security flaws." }
    ]
  },
  phishing: {
    id: "phishing",
    title: "Phishing Detection",
    description: "Identify social engineering attacks",
    icon: Fish,
    color: "text-primary",
    bgColor: "bg-primary/10",
    introduction: "Phishing is a social engineering attack where attackers impersonate trusted entities to trick victims into revealing sensitive information, clicking malicious links, or downloading malware.",
    questions: [
      { id: 1, question: "An email from 'support@amaz0n-security.com' asks you to verify your account. What's suspicious?", options: ["The email mentions security", "It's asking for verification", "The domain uses '0' instead of 'o' and isn't amazon.com", "It was sent during business hours"], correctAnswer: 2, explanation: "Attackers use lookalike domains (typosquatting) with character substitutions. 'amaz0n-security.com' is not Amazon's official domain (amazon.com)." },
      { id: 2, question: "A message says 'Your account will be suspended in 24 hours unless you click here.' What tactic is this?", options: ["Personalization", "Authority", "Urgency and fear", "Reciprocity"], correctAnswer: 2, explanation: "Creating urgency pressures victims to act quickly without thinking critically. Legitimate organizations rarely threaten immediate account suspension via email." },
      { id: 3, question: "Before clicking a link in an email, what should you do?", options: ["Click it quickly to see where it goes", "Hover over it to preview the actual URL", "Forward it to a friend to check", "Open it in a new tab"], correctAnswer: 1, explanation: "Hovering reveals the actual destination URL. Phishing links often display one URL but redirect to a completely different malicious site." },
      { id: 4, question: "You receive an email from your 'CEO' asking for an urgent wire transfer. The email looks legitimate. What should you do?", options: ["Complete the transfer immediately—it's the CEO", "Reply to the email asking for confirmation", "Verify through a different channel (phone call, in-person)", "Forward to IT and wait for a response"], correctAnswer: 2, explanation: "This is a Business Email Compromise (BEC) attack. Always verify unusual requests through a separate communication channel—not by replying to the suspicious email." },
      { id: 5, question: "What is spear phishing?", options: ["A generic phishing attack for many targets", "A targeted attack against a specific person using personal information", "A phishing attack using a spear weapon", "Fishing with a spear"], correctAnswer: 1, explanation: "Spear phishing is targeted and personalized using information about the victim (name, job, company, recent activities) making it more convincing than generic phishing." },
      { id: 6, question: "How should you report a phishing email?", options: ["Reply to correct them", "Forward to friends", "Report to your company's security team and email provider", "Delete and forget about it"], correctAnswer: 2, explanation: "Reporting allows security teams to block attacks and providers to improve filters. Forwarding suspicious emails helps identify phishing campaigns." },
      { id: 7, question: "What is a zero-day phishing attack?", options: ["An attack that happens at midnight", "A newly discovered phishing technique unknown to security vendors", "An attack lasting zero seconds", "Phishing on Sundays"], correctAnswer: 1, explanation: "Zero-day phishing uses new techniques or URLs that haven't been catalogued by security systems yet, making them harder to detect with standard filters." },
      { id: 8, question: "How do attackers use urgency in phishing?", options: ["Urgency doesn't work", "Pushes victims to act without thinking critically about legitimacy", "Makes attacks slower", "Gives victims time to verify"], correctAnswer: 1, explanation: "Artificial urgency (account expiring, limited time offer, immediate action required) bypasses the critical thinking that would reveal the phishing attempt." },
      { id: 9, question: "What is credential harvesting?", options: ["Collecting crops", "Stealing usernames/passwords through fake login pages", "Storing credentials safely", "A legitimate practice"], correctAnswer: 1, explanation: "Phishing emails direct victims to fake login pages. Victims enter credentials thinking they're on the real site, giving attackers valid credentials." },
      { id: 10, question: "How can you verify an email actually came from your bank?", options: ["Check if it mentions your bank name", "Look up the bank's official phone number and call them directly", "Trust the sender address line", "Bank emails are always legitimate"], correctAnswer: 1, explanation: "Sender addresses can be spoofed. Call the official number from your bank statement or website to verify. Banks never ask for passwords via email." },
      { id: 11, question: "What is whaling?", options: ["Fishing for whales", "Phishing attacks targeting high-value targets like executives", "A type of email security", "A network protocol"], correctAnswer: 1, explanation: "Whaling is spear phishing targeting executives (CEOs, CFOs). Because executives have high access and authority, they're high-value targets." },
      { id: 12, question: "How do phishing emails often create false credibility?", options: ["Using real company logos and branding", "Copying legitimate websites' appearance", "Using technical jargon", "All of the above"], correctAnswer: 3, explanation: "Sophisticated phishing uses logos, branding, official language, and accurate details to appear legitimate. This social engineering makes victims less suspicious." },
      { id: 13, question: "What should you NEVER do in response to a phishing email?", options: ["Report it to security", "Ignore it", "Click links or download attachments", "Tell others"], correctAnswer: 2, explanation: "Clicking links or opening attachments can execute malware or keyloggers. Never interact with suspicious emails—forward them to security instead." },
      { id: 14, question: "How do two-factor authentication (2FA) help against phishing?", options: ["2FA prevents phishing", "Even if password is stolen, attacker needs the second factor to access account", "2FA is only for banks", "2FA isn't effective"], correctAnswer: 1, explanation: "2FA adds a second verification step (code, biometric, hardware token). Even if phishing steals your password, attackers can't access your account without the second factor." },
      { id: 15, question: "What is a clone phishing attack?", options: ["Creating an identical website", "Taking a legitimate email and modifying the links to phishing sites", "Duplicating user accounts", "An advanced firewall"], correctAnswer: 1, explanation: "Clone phishing intercepts legitimate emails, copies them, changes links to malicious ones, and resends them making them appear to come from the legitimate organization." }
    ]
  }
};

const LabExercise = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPractical, setShowPractical] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Save score to database
  const saveScoreToDatabase = async (finalScore: number, totalQuestions: number, labTitle: string) => {
    try {
      const userProfile = JSON.parse(localStorage.getItem('guarded-user-profile') || '{}');
      const { error } = await (supabase as any).from('lab_scores').insert({
        user_id: userProfile.id || 'anonymous',
        student_name: userProfile.name || 'Unknown',
        student_email: userProfile.email || 'unknown@example.com',
        lab_id: labId,
        lab_title: labTitle,
        quiz_score: finalScore,
        total_questions: totalQuestions,
      });
      if (error) {
        console.error('Error saving score:', error);
      } else {
        toast.success('Score saved to your dashboard!');
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const lab = labId ? labsData[labId] : null;
  const practical = labId ? practicalLabsData[labId] : null;

  if (!lab) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Lab Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested lab doesn't exist.</p>
          <Link to="/labs"><Button>Back to Labs</Button></Link>
        </Card>
      </div>
    );
  }

  const question = lab.questions[currentQuestion];
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / lab.questions.length) * 100;

  const handleSubmit = () => {
    if (selectedAnswer === null) { toast.error("Please select an answer"); return; }
    if (selectedAnswer === question.correctAnswer) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < lab.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      // Save score to database
      saveScoreToDatabase(score, lab.questions.length, lab.title);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setShowPractical(false);
    setCurrentExercise(0);
    setShowSolution(false);
  };

  const handleStartPractical = () => {
    setShowPractical(true);
    setCurrentExercise(0);
    setShowSolution(false);
  };

  const IconComponent = lab.icon;

  // Practical Lab View
  if (showPractical && practical) {
    const exercise = practical.exercises[currentExercise];
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/labs"><Button variant="ghost" size="sm">All Labs</Button></Link>
              <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            </nav>
          </div>
        </header>

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setShowPractical(false)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Quiz Results
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl ${practical.bgColor}`}>
                <Wrench className={`w-8 h-8 ${practical.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{practical.title}</h1>
                <p className="text-muted-foreground">Exercise {currentExercise + 1} of {practical.exercises.length}</p>
              </div>
            </div>

            <Progress value={((currentExercise + 1) / practical.exercises.length) * 100} className="h-2 mb-6" />

            <Card className="glass-card mb-6">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">Exercise {exercise.id}</Badge>
                <CardTitle className="mt-2">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 text-primary">Scenario</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm bg-secondary/30 p-4 rounded-lg font-mono">{exercise.scenario}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-primary">Your Task</h4>
                  <p className="text-foreground">{exercise.task}</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm"><strong className="text-yellow-500">💡 Hint:</strong> {exercise.hint}</p>
                </div>

                <Button onClick={() => setShowSolution(!showSolution)} variant="outline" className="w-full gap-2">
                  {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </Button>

                {showSolution && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <h4 className="font-medium mb-2 text-primary">Solution</h4>
                      <p className="text-foreground whitespace-pre-wrap">{exercise.solution}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <h4 className="font-medium mb-2">Detailed Explanation</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap text-sm">{exercise.explanation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => { setCurrentExercise(Math.max(0, currentExercise - 1)); setShowSolution(false); }} disabled={currentExercise === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              {currentExercise < practical.exercises.length - 1 ? (
                <Button onClick={() => { setCurrentExercise(currentExercise + 1); setShowSolution(false); }} className="bg-primary text-primary-foreground">
                  Next Exercise <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link to="/labs"><Button className="bg-primary text-primary-foreground">Complete Lab</Button></Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/labs"><Button variant="ghost" size="sm">All Labs</Button></Link>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/labs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Labs
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-xl ${lab.bgColor}`}>
              <IconComponent className={`w-8 h-8 ${lab.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{lab.title}</h1>
              <p className="text-muted-foreground">{lab.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!quizCompleted ? (
            <>
              {currentQuestion === 0 && !showResult && (
                <Card className="glass-card mb-6">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">{lab.introduction}</p>
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Question {currentQuestion + 1} of {lab.questions.length}</Badge>
                    <Badge variant="outline" className="text-primary border-primary/30">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{question.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : ""} onValueChange={(value) => !showResult && setSelectedAnswer(value !== "" ? parseInt(value) : null)} className="space-y-3">
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      return (
                        <div key={index} className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${showResult ? index === question.correctAnswer ? "border-green-500/50 bg-green-500/10" : isSelected ? "border-destructive/50 bg-destructive/10" : "border-border/50" : isSelected ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showResult} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">{option}</Label>
                          {showResult && index === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {showResult && isSelected && index !== question.correctAnswer && <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {showResult && (
                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
                      <p className="text-sm font-medium text-foreground mb-2">{selectedAnswer === question.correctAnswer ? "✅ Correct!" : "❌ Incorrect"}</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    {!showResult ? (
                      <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">Submit Answer</Button>
                    ) : (
                      <Button onClick={handleNext} className="bg-primary text-primary-foreground">
                        {currentQuestion < lab.questions.length - 1 ? <>Next Question <ChevronRight className="w-4 h-4 ml-2" /></> : "See Results"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="glass-card text-center">
              <CardContent className="pt-8 pb-8">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${score >= lab.questions.length * 0.75 ? "bg-green-500/20" : score >= lab.questions.length * 0.5 ? "bg-yellow-500/20" : "bg-destructive/20"}`}>
                  {score >= lab.questions.length * 0.75 ? <CheckCircle className="w-10 h-10 text-green-500" /> : score >= lab.questions.length * 0.5 ? <AlertTriangle className="w-10 h-10 text-yellow-500" /> : <XCircle className="w-10 h-10 text-destructive" />}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
                <p className="text-muted-foreground mb-6">You scored {score} out of {lab.questions.length} questions correctly.</p>
                <div className="text-4xl font-bold mb-6">
                  <span className={score >= lab.questions.length * 0.75 ? "text-green-500" : score >= lab.questions.length * 0.5 ? "text-yellow-500" : "text-destructive"}>
                    {Math.round((score / lab.questions.length) * 100)}%
                  </span>
                </div>

                {practical && (
                  <div className="mb-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <Wrench className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Ready for Hands-On Practice?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Apply what you learned with {practical.exercises.length} practical exercises featuring real-world scenarios.</p>
                    <Button onClick={handleStartPractical} className="bg-primary text-primary-foreground gap-2">
                      <Wrench className="w-4 h-4" /> Start Practical Lab
                    </Button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleRestart} variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> Try Again</Button>
                  <Link to="/labs"><Button className="bg-primary text-primary-foreground">Back to Labs</Button></Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default LabExercise;
