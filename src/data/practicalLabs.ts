import { Shield, Database, Lock, Fish } from "lucide-react";

export interface PracticalExercise {
  id: number;
  title: string;
  scenario: string;
  task: string;
  hint: string;
  solution: string;
  explanation: string;
}

export interface LabPracticalData {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  practicalIntro: string;
  exercises: PracticalExercise[];
}

export const practicalLabsData: Record<string, LabPracticalData> = {
  idor: {
    id: "idor",
    title: "IDOR Practical Lab",
    description: "Hands-on IDOR vulnerability exercises",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    practicalIntro: "Now that you've completed the IDOR quiz, let's put your knowledge into practice. In these exercises, you'll analyze real-world scenarios and identify IDOR vulnerabilities. Think like an attacker to understand how these flaws can be exploited, then think like a defender to understand how to fix them.",
    exercises: [
      {
        id: 1,
        title: "Profile Access Analysis",
        scenario: "You're testing a social media application. After logging in as user 'alice', you navigate to your profile page. The URL shows: https://social-app.com/api/v1/users/1542/profile\n\nYou notice the response includes sensitive information:\n{\n  \"id\": 1542,\n  \"username\": \"alice\",\n  \"email\": \"alice@example.com\",\n  \"phone\": \"+1-555-0123\",\n  \"address\": \"123 Main St, Anytown\",\n  \"ssn_last4\": \"5678\"\n}",
        task: "Identify the IDOR vulnerability and describe how you would test if it's exploitable.",
        hint: "Consider what happens if you change the user ID in the URL to a different number.",
        solution: "Change the URL from /users/1542/profile to /users/1543/profile (or any other user ID) and observe if you can access another user's sensitive profile data.",
        explanation: "This is a classic horizontal privilege escalation via IDOR. The application uses predictable, sequential user IDs and fails to verify that the authenticated user (alice, ID 1542) has permission to access the requested profile. An attacker could enumerate through user IDs to access sensitive personal information of all users, potentially violating privacy regulations like GDPR.\n\nTo fix this vulnerability:\n1. Always verify the authenticated user has permission to access the requested resource\n2. Consider using unpredictable UUIDs instead of sequential IDs\n3. Implement rate limiting to prevent enumeration\n4. Log access attempts for security monitoring"
      },
      {
        id: 2,
        title: "Document Download Vulnerability",
        scenario: "A healthcare portal allows patients to download their medical records. The download link follows this pattern:\n\nhttps://health-portal.com/documents/download?doc_id=MR-2024-00847\n\nThe document IDs appear to follow a pattern: MR-YEAR-SEQUENTIAL_NUMBER",
        task: "Explain why this implementation is vulnerable and what sensitive data could be exposed.",
        hint: "Medical records contain highly sensitive protected health information (PHI).",
        solution: "The predictable document ID pattern (MR-YEAR-SEQUENTIAL) allows attackers to guess and download other patients' medical records by changing the sequential number or year.",
        explanation: "This IDOR vulnerability is particularly severe because:\n\n1. **Predictable IDs**: The pattern MR-2024-00847 reveals the format, making it easy to construct valid document IDs\n\n2. **HIPAA Violation**: Unauthorized access to medical records violates healthcare privacy laws, potentially resulting in millions in fines\n\n3. **Sensitive Data Exposure**: Medical records may contain:\n   - Diagnoses and conditions\n   - Medications and treatments\n   - Social Security Numbers\n   - Insurance information\n   - Mental health records\n\n**Secure Implementation**:\n- Generate cryptographically random document tokens\n- Store document ownership in database\n- Verify user's right to access before serving\n- Log all access attempts\n- Implement download rate limiting"
      },
      {
        id: 4,
        title: "API Endpoint Enumeration",
        scenario: "A REST API has version numbers in URLs:\n/api/v1/users\n/api/v2/users\n/api/v3/users\n\nDifferent developers implemented security in different versions. Version 1 checks authorization, but version 2 and 3 don't.",
        task: "Explain how attackers would discover and exploit multiple API versions.",
        hint: "Not all API versions receive the same security updates.",
        solution: "1. Systematically test different API versions\n2. Test authorization in /api/v1/users/{id} - properly blocked\n3. Test same request in /api/v2/users/{id} - authorization bypassed\n4. Access data through the unprotected version\n5. Combine this with enumeration to map all accessible resources",
        explanation: "**API Version Exploitation**:\n\n**Discovery Process**:\n```bash\n# Test version discovery\ncurl /api/v1/users/5\ncurl /api/v2/users/5  \ncurl /api/v3/users/5\ncurl /api/v4/users/5\n# Find unprotected versions\n```\n\n**Real-World Cases**:\n- Developers maintain legacy versions for compatibility\n- Security patches applied to current version only\n- Old versions assumed deprecated but still active\n- Attackers access through older, less secured paths\n\n**Prevention**:\n- Decommission old API versions completely\n- Identical security on all versions\n- Monitor access patterns for unusual version usage\n- Document when versions reach end-of-life"
      },
      {
        id: 5,
        title: "Rate Limiting Bypass for Enumeration",
        scenario: "An HR system at:\n/api/employees/list?employee_id=\n\nAttempts to list an employee's details. The system has rate limiting (10 requests per minute), but the rate limit is applied per IP and can be bypassed by:\n- Changing User-Agent headers\n- Adding X-Forwarded-For headers\n- Using distributed traffic patterns\n\nYou need to enumerate all employee IDs (assuming they're sequential from 1000-9999).",
        task: "Design a strategy to bypass rate limiting and extract all employee IDs and basic information.",
        hint: "Rate limits without proper verification of the limiting factor can be bypassed.",
        solution: "1. Use multiple User-Agent headers (appears as different browsers)\n2. Rotate X-Forwarded-For IPs (appears to come from different locations)\n3. Distribute requests over time to stay under limits\n4. Use tools like SQLmap or custom scripts with threading\n5. Make requests with offsets: ?employee_id=1000, ?employee_id=2000, etc.",
        explanation: "**Rate Limit Bypass Techniques**:\n\n**1. Header Manipulation**:\n```bash\n# Different User-Agents\nX-Forwarded-For: 192.168.1.1\nX-Forwarded-For: 192.168.1.2\nX-Forwarded-For: 192.168.1.3\n```\n\n**2. Request Distribution**:\n- Spread requests over extended time\n- Mix with legitimate traffic patterns\n- Randomize delays between requests\n\n**3. Enumeration Tactics**:\n```python\nfor emp_id in range(1000, 10000, 100):  # Jump by 100s\n    headers = {\n        'User-Agent': random_agent(),\n        'X-Forwarded-For': random_ip()\n    }\n    response = requests.get(f'/api/employees/{emp_id}', headers=headers)\n```\n\n**Secure Rate Limiting**:\n- Verify source (not just IP)\n- Use account-based limits\n- Implement progressive delays\n- Log and alert on patterns\n- Require authentication"
      }
    ]
  },
  "sql-injection": {
    id: "sql-injection",
    title: "SQL Injection Practical Lab",
    description: "Hands-on SQL injection exercises",
    icon: Database,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    practicalIntro: "SQL injection remains one of the most critical web vulnerabilities. In these exercises, you'll analyze vulnerable code patterns, understand how attackers construct payloads, and learn secure coding practices that prevent these attacks.",
    exercises: [
      {
        id: 1,
        title: "Login Bypass Analysis",
        scenario: "A developer wrote this Python authentication code:\n\n```python\ndef login(username, password):\n    query = f\"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'\"\n    result = database.execute(query)\n    if result:\n        return \"Login successful\"\n    return \"Login failed\"\n```\n\nThe login form simply passes user input to this function.",
        task: "Craft an input that would bypass authentication without knowing any valid password.",
        hint: "Remember that SQL comments (--) ignore everything after them.",
        solution: "Username: admin'--\nPassword: anything (or leave empty)\n\nThis creates: SELECT * FROM users WHERE username = 'admin'--' AND password = 'anything'\n\nThe -- comments out the password check entirely.",
        explanation: "**How the Attack Works**:\n\n1. Original query expects: `...WHERE username = 'alice' AND password = 'secret123'`\n\n2. With malicious input `admin'--`:\n   - The `'` closes the username string early\n   - `--` starts a SQL comment\n   - Everything after (AND password check) is ignored\n\n3. Final query becomes: `SELECT * FROM users WHERE username = 'admin'`\n\n**Alternative Payloads**:\n- `' OR '1'='1'--` (returns all users)\n- `' OR 1=1--` (same effect)\n- `admin' AND '1'='1` (if comment doesn't work)\n\n**Secure Solution**:\n```python\ndef login(username, password):\n    query = \"SELECT * FROM users WHERE username = ? AND password = ?\"\n    result = database.execute(query, (username, password))\n    # Parameters are safely escaped\n```"
      },
      {
        id: 2,
        title: "Data Extraction via UNION",
        scenario: "A product search feature uses this code:\n\n```sql\nSELECT name, price, description \nFROM products \nWHERE category = '$user_input'\n```\n\nYou've discovered the search is vulnerable. The original query returns 3 columns.",
        task: "Construct a UNION-based attack to extract usernames and password hashes from a 'users' table.",
        hint: "UNION requires the same number of columns. NULL can fill extra columns.",
        solution: "Search input: ' UNION SELECT username, password, NULL FROM users--\n\nThis creates:\nSELECT name, price, description FROM products WHERE category = '' UNION SELECT username, password, NULL FROM users--",
        explanation: "**UNION Attack Steps**:\n\n1. **Determine Column Count**: Try adding ORDER BY clauses\n   - `' ORDER BY 1--` (works)\n   - `' ORDER BY 3--` (works)\n   - `' ORDER BY 4--` (error = 3 columns)\n\n2. **Find Displayed Columns**: See which columns appear on page\n   - `' UNION SELECT 'a','b','c'--`\n\n3. **Extract Data**: Replace with actual data\n   - `' UNION SELECT username, password, email FROM users--`\n\n**Real Attack Progression**:\n```sql\n-- Step 1: Find table names\n' UNION SELECT table_name, NULL, NULL FROM information_schema.tables--\n\n-- Step 2: Find column names\n' UNION SELECT column_name, NULL, NULL FROM information_schema.columns WHERE table_name='users'--\n\n-- Step 3: Extract data\n' UNION SELECT username, password, ssn FROM users--\n```\n\n**Prevention**: Use parameterized queries that treat user input as data, never as SQL code."
      },
      {
        id: 3,
        title: "Blind SQL Injection",
        scenario: "A website's forgot password feature shows:\n- \"User exists\" if email is found\n- \"User not found\" if email doesn't exist\n\nThe underlying query:\n```sql\nSELECT * FROM users WHERE email = '$email'\n```\n\nNo error messages or data are displayed, only the two responses above.",
        task: "Explain how an attacker could still extract data using this boolean-based blind SQL injection.",
        hint: "If you can ask yes/no questions, you can extract data one character at a time.",
        solution: "Use conditional statements to ask yes/no questions about the data:\n\ntest@example.com' AND SUBSTRING(password,1,1)='a'--\n\nIf response is 'User exists', first character of password is 'a'. Repeat for each character position and value.",
        explanation: "**Blind SQL Injection Technique**:\n\nEven without visible output, attackers can extract data by asking true/false questions:\n\n**Extract Password Length**:\n```sql\n-- Returns 'User exists' if password length is 8\ntest@email.com' AND LENGTH(password)=8--\n```\n\n**Extract Characters One by One**:\n```sql\n-- Is first character 'a'?\ntest@email.com' AND SUBSTRING(password,1,1)='a'--\n-- Is first character 'b'?\ntest@email.com' AND SUBSTRING(password,1,1)='b'--\n-- Continue until 'User exists' response\n```\n\n**Binary Search for Efficiency**:\n```sql\n-- Is first char ASCII value > 64?\ntest@email.com' AND ASCII(SUBSTRING(password,1,1))>64--\n```\n\n**Automated Tools**: SQLmap and similar tools automate this process, extracting entire databases through thousands of yes/no queries.\n\n**Time-Based Variant**:\nIf no visible difference, use time delays:\n```sql\ntest@email.com' AND IF(SUBSTRING(password,1,1)='a',SLEEP(5),0)--\n```"
      },
      {
        id: 4,
        title: "Second-Order SQL Injection",
        scenario: `A user profile system works as follows:
1. Admin sets a bio field for user: "John's profile"
2. The bio is safely inserted into a database using parameterized queries
3. Later, when the user's profile is displayed, the bio is used in a new SQL query WITHOUT parameterization:

\`\`\`sql
SELECT * FROM user_posts WHERE owner = '' + user.bio + ''
\`\`\``,
        task: "How would an attacker exploit this second-order SQL injection vulnerability?",
        hint: "The injection isn't immediate—it's stored and executed later.",
        solution: "1. Set bio field to: admin' --\n2. This is safely stored in database\n3. When profile is retrieved and used in the second query:\n   SELECT * FROM user_posts WHERE owner = 'admin' --'\n4. The -- comments out restrictions, allowing viewing of admin's posts",
        explanation: "**Second-Order SQL Injection**:\n\nDiffers from direct injection because:\n1. **Storage Phase**: Malicious payload stored safely (parameterized query)\n2. **Retrieval Phase**: Payload retrieved and used unsafely in new query\n3. **Delayed Trigger**: Attack happens later, not immediately\n\n**Why It's Dangerous**:\n- Stored safely so no immediate error\n- Appears legitimate in database\n- Found much later during audits\n- Harder to trace to original input\n\n**Real-World Example**:\n```javascript\n// Step 1: User sets profile (safe)\nusing (SqlCommand cmd = new SqlCommand()) {\n    cmd.CommandText = \"UPDATE users SET bio = @bio WHERE id = @id\";\n    cmd.Parameters.AddWithValue(\"@bio\", userInput);  // Safe!\n}\n\n// Step 2: Show user's posts (UNSAFE)\nusing (SqlCommand cmd = new SqlCommand()) {\n    cmd.CommandText = \"SELECT * FROM posts WHERE owner = '\" + user.bio + \"'\";\n    // BUG: Using user.bio directly in SQL!\n}\n```\n\n**Prevention**:\n- Use parameterized queries EVERYWHERE\n- Validate and sanitize data at every layer\n- Never trust data from database"
      },
      {
        id: 5,
        title: "SQL Injection in ORDER BY Clause",
        scenario: "A product listing has a sort feature:\n\n```python\nsort_column = request.GET['sort']  # e.g., 'price' or 'name'\nquery = f\"SELECT * FROM products ORDER BY {sort_column}\"\nresults = database.execute(query)\n```\n\nDevelopers often overlook the ORDER BY clause because it seems safe.",
        task: "Construct a SQL injection payload that works in the ORDER BY clause.",
        hint: "ORDER BY accepts expressions and CASE statements.",
        solution: "Inject: CASE WHEN (expression) THEN column1 ELSE column2 END\nExample: price, CASE WHEN (SELECT COUNT(*) FROM users)>0 THEN name ELSE id END\n\nOr use UNION: 1 UNION SELECT username, password FROM users--",
        explanation: "**ORDER BY SQL Injection**:\n\nOften overlooked because ORDER BY seems to only handle column names:\n\n**Valid Payloads**:\n```sql\n-- Boolean-based blind SQL injection\nORDER BY 1; SELECT * FROM users WHERE '1'='1\n\n-- CASE statement\nORDER BY CASE WHEN (1=1) THEN price ELSE name END\n\n-- Subquery\nORDER BY (SELECT COUNT(*) FROM products WHERE price > 50)\n\n-- UNION (if detectable columns exist)\nORDER BY 1 UNION SELECT username FROM users\n```\n\n**Attack Example**:\n```python\n# Vulnerable\nsort = \"name; DROP TABLE products--\"\nquery = f\"SELECT * FROM products ORDER BY {sort}\"\n\n# Result\nSELECT * FROM products ORDER BY name; DROP TABLE products--\n```\n\n**Prevention**:\n```python\n# WRONG\nquery = f\"SELECT * FROM products ORDER BY {sort_column}\"\n\n# CORRECT\nallowed_columns = ['price', 'name', 'date', 'rating']\nif sort_column not in allowed_columns:\n    sort_column = 'price'\nquery = f\"SELECT * FROM products ORDER BY {sort_column}\"\n\n# ALSO CORRECT (parameterized)\n# Note: Most databases don't allow parameterizing column names\n# So use whitelist approach above\n```"
      }
    ]
  },
  "access-control": {
    id: "access-control",
    title: "Access Control Practical Lab",
    description: "Hands-on authorization exercises",
    icon: Lock,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    practicalIntro: "Access control vulnerabilities are consistently in the OWASP Top 10 because they're easy to introduce and often overlooked during development. These exercises will help you identify broken access control patterns and understand how to implement proper authorization.",
    exercises: [
      {
        id: 1,
        title: "Horizontal Privilege Escalation",
        scenario: "A banking application allows users to view their account statements:\n\nURL: /account/statements?account_id=ACC-1234567\n\nYour account ID is ACC-1234567. You notice other customers have similar IDs (ACC-1234568, ACC-1234569, etc.)\n\nThe server checks that you're logged in but doesn't verify account ownership.",
        task: "Describe the attack and its potential impact on a banking application.",
        hint: "Consider what financial information might be exposed in account statements.",
        solution: "Change account_id parameter to ACC-1234568 or other sequential IDs to view other customers' financial statements, including transaction history, balance, account numbers, and personal information.",
        explanation: "**Horizontal Privilege Escalation Attack**:\n\nThis allows accessing resources belonging to users at the same privilege level.\n\n**Attack Steps**:\n1. Log into your legitimate account\n2. Navigate to statements page\n3. Change account_id in URL to other values\n4. Access other customers' financial data\n\n**Exposed Information**:\n- Transaction history and patterns\n- Account balances\n- Linked accounts and transfers\n- Personal identification information\n- Spending habits and locations\n\n**Business Impact**:\n- Regulatory violations (PCI-DSS, financial regulations)\n- Customer trust destruction\n- Fraud enablement\n- Competitive intelligence theft\n- Legal liability\n\n**Secure Implementation**:\n```python\ndef get_statements(account_id, user):\n    account = get_account(account_id)\n    # Verify ownership!\n    if account.owner_id != user.id:\n        raise AuthorizationError(\"Access denied\")\n    return account.statements\n```"
      },
      {
        id: 2,
        title: "Vertical Privilege Escalation",
        scenario: "A web application has a regular user interface at:\n/dashboard\n\nThrough source code inspection, you discover admin endpoints:\n/admin/users - User management\n/admin/settings - System configuration\n/admin/reports - All system reports\n\nThese endpoints are not linked in the regular user interface but the server doesn't properly verify admin privileges.",
        task: "Explain how you would test for vertical privilege escalation and what should be done to secure these endpoints.",
        hint: "Hidden doesn't mean protected. Security through obscurity is not security.",
        solution: "Simply navigate to /admin/users, /admin/settings, etc. while logged in as a regular user. If the pages load without proper role checking, vertical privilege escalation is possible.",
        explanation: "**Vertical Privilege Escalation**:\n\nAccessing functionality intended for higher-privileged users (e.g., regular user accessing admin features).\n\n**Common Causes**:\n1. **Security by Obscurity**: Assuming hidden URLs are secure\n2. **Client-Side Checks Only**: JavaScript hiding menu items\n3. **Missing Server Checks**: Assuming frontend prevents access\n4. **Inconsistent Enforcement**: Some admin pages checked, others not\n\n**Testing Approach**:\n```bash\n# Try accessing admin endpoints directly\ncurl -H \"Cookie: session=user_session\" /admin/users\ncurl -H \"Cookie: session=user_session\" /admin/settings\n\n# Try changing role parameters\nPOST /api/action\n{\"action\": \"delete_user\", \"role\": \"admin\"}\n```\n\n**Secure Implementation**:\n```python\n@app.route('/admin/users')\ndef admin_users():\n    user = get_current_user()\n    if not user.has_role('admin'):  # Server-side check!\n        abort(403)\n    return render_admin_users()\n```\n\n**Defense in Depth**:\n- Role-based access control (RBAC)\n- Check permissions on every request\n- Log and alert on unauthorized attempts\n- Regular access control audits"
      },
      {
        id: 3,
        title: "API Authorization Bypass",
        scenario: "A mobile app's API uses this endpoint for user updates:\n\nPUT /api/v1/users/5432\n{\n  \"name\": \"Alice Smith\",\n  \"email\": \"alice@example.com\",\n  \"role\": \"user\"\n}\n\nThe API validates the JWT token but doesn't restrict which fields users can modify.",
        task: "Identify the mass assignment vulnerability and construct a malicious request.",
        hint: "What happens if you add fields that aren't in the normal user interface?",
        solution: "Add the role field in the request body:\nPUT /api/v1/users/5432\n{\n  \"name\": \"Alice Smith\",\n  \"role\": \"admin\"\n}\n\nIf the API blindly updates all provided fields, the user promotes themselves to admin.",
        explanation: "**Mass Assignment / Overposting Vulnerability**:\n\nOccurs when APIs accept more parameters than intended and apply them directly to database objects.\n\n**Attack Vectors**:\n```json\n// Normal request\n{\"name\": \"Alice\", \"email\": \"alice@example.com\"}\n\n// Malicious additions\n{\n  \"name\": \"Alice\",\n  \"role\": \"admin\",\n  \"verified\": true,\n  \"credits\": 999999,\n  \"subscription\": \"enterprise\"\n}\n```\n\n**Real-World Examples**:\n- GitHub 2012: Mass assignment in public key upload\n- Users adding themselves to private repositories\n- Escalating subscription tiers without payment\n\n**Secure Implementation**:\n```python\n# Whitelist allowed fields\nALLOWED_USER_FIELDS = ['name', 'email', 'phone']\n\ndef update_user(user_id, data):\n    user = get_user(user_id)\n    for field in ALLOWED_USER_FIELDS:\n        if field in data:\n            setattr(user, field, data[field])\n    user.save()\n```\n\n**Prevention**:\n- Explicit field whitelisting\n- Separate DTOs for input/output\n- Different endpoints for different privilege levels\n- Input validation and sanitization"
      },
      {
        id: 4,
        title: "Function-Level Access Control Missing",
        scenario: "An e-learning platform has these endpoints:\n- GET /teacher/courses - View teacher's courses\n- GET /teacher/students - View enrolled students  \n- POST /teacher/grades - Submit student grades\n- GET /admin/reports - Admin analytics dashboard\n- POST /admin/settings - Change system settings\n\nAuthentication is enforced (must be logged in), but function-level access control is not properly implemented. Regular users can change their account role parameter.",
        task: "Explain how a regular user could escalate to admin and what data/functions they could access.",
        hint: "Check if role is enforced server-side or if it can be changed by the user.",
        solution: "If the application checks role from a client-side token or cookie:\n1. Regular user intercepts the JWT/session cookie\n2. Modifies the role field from 'user' to 'admin'\n3. Gains access to /admin/reports and /admin/settings\n4. Can change system settings or view sensitive analytics\n\nOr if role is stored in localStorage, directly modify it in browser dev tools.",
        explanation: "**Function-Level Access Control**:\n\nOften abbreviated as FLAC, this enforces that only authorized users can access specific functionality.\n\n**Vulnerable Pattern**:\n```javascript\n// Frontend checks role (insecure!)\nif (user.role === 'admin') {\n    showAdminMenu();\n}\n\n// But anyone can change role in browser\nlocalStorage.setItem('role', 'admin');\n```\n\n**Secure Pattern**:\n```python\n# Backend enforces role on EVERY request\n@app.route('/admin/settings', methods=['POST'])\n@require_auth  # Verify logged in\ndef admin_settings():\n    user = get_current_user()\n    if user.role != 'admin':  # Server-side check!\n        abort(403)\n    # Process admin action\n```\n\n**Detection Methods**:\n1. Intercept requests with proxy (Burp Suite)\n2. Check every endpoint with lower-privileged account\n3. Look for role parameters you can modify\n4. Test admin functions with regular account\n5. Check JWT/token for modifiable claims\n\n**Real Impact**:\n- Modify user permissions\n- Disable security features\n- Export sensitive data\n- Create backdoor accounts\n- Delete audit logs"
      },
      {
        id: 5,
        title: "Insecure Direct Object References in Admin Panel",
        scenario: "An admin panel allows viewing user details at:\n/admin/users?uid=123\n\nThe system checks if you're an admin, but fails to verify if the admin accessing the endpoint is authorized for that specific user. For example:\n- Admin A can manage Company A users\n- Admin B can manage Company B users\n- But both access /admin/users?uid=123",
        task: "Describe how this could lead to unauthorized access across company boundaries in a multi-tenant system.",
        hint: "Multi-tenant systems need tenant-level AND user-level authorization checks.",
        solution: "1. Admin A (Company A) accesses /admin/users?uid=123 (Company B user)\n2. System checks: Is user an admin? Yes ✓\n3. System fails to check: Is this user in YOUR company?\n4. Admin A can now see and modify Company B user data\n5. Data breach across customer boundaries",
        explanation: "**Multi-Tenant IDOR in Admin Functions**:\n\nEven admins need proper authorization scoping.\n\n**Vulnerable Code**:\n```python\n@app.route('/admin/users')\n@require_admin  # Only checks if admin\ndef get_user_details():\n    user_id = request.args.get('uid')\n    user = User.query.get(user_id)  # BUG: No tenant check!\n    return jsonify(user)\n```\n\n**Secure Code**:\n```python\n@app.route('/admin/users')\n@require_admin\ndef get_user_details():\n    user_id = request.args.get('uid')\n    admin = get_current_user()\n    user = User.query.get(user_id)\n    \n    # Check tenant ownership!\n    if user.tenant_id != admin.tenant_id:\n        abort(403)\n    \n    return jsonify(user)\n```\n\n**Multi-Tenant Security Requirements**:\n1. Every data access must verify tenant ownership\n2. Use database row-level security (RLS) policies\n3. Add tenant_id to every query\n4. Test accessing other tenant's data as admin\n5. Implement audit logging for cross-tenant access attempts"
      }
    ]
  },
  phishing: {
    id: "phishing",
    title: "Phishing Detection Practical Lab",
    description: "Hands-on phishing analysis exercises",
    icon: Fish,
    color: "text-primary",
    bgColor: "bg-primary/10",
    practicalIntro: "Detecting phishing attempts requires careful analysis of multiple factors. In these exercises, you'll examine realistic phishing scenarios and practice identifying the red flags that distinguish malicious communications from legitimate ones.",
    exercises: [
      {
        id: 1,
        title: "Email Header Analysis",
        scenario: "You received this email at your work address:\n\nFrom: IT Security <security@company-support.net>\nSubject: Urgent: Password Expires in 24 Hours\nDate: Monday, 10:47 PM\n\n\"Dear Employee,\n\nYour corporate password will expire in 24 hours. To maintain access to company systems, please verify your credentials immediately by clicking the link below:\n\n[Verify Account Now]\n(links to: https://company-secure-login.com/verify)\n\nFailure to verify will result in account suspension.\n\nIT Security Department\"\n\nYour company's actual domain is: company.com",
        task: "List all the red flags in this email that indicate it's a phishing attempt.",
        hint: "Check the sender domain, the link domain, timing, and language patterns.",
        solution: "Red flags:\n1. Sender domain (company-support.net) doesn't match company.com\n2. Link domain (company-secure-login.com) is also not company.com\n3. Sent at 10:47 PM - unusual time for IT communications\n4. Generic greeting \"Dear Employee\" instead of your name\n5. Urgency and threat (24 hours, suspension)\n6. No ticket number or IT department contact info\n7. Request to click link instead of using normal password reset",
        explanation: "**Phishing Analysis Framework**:\n\n**1. Sender Analysis**:\n- Expected: security@company.com\n- Received: security@company-support.net\n- Verdict: ❌ Spoofed/lookalike domain\n\n**2. Link Analysis**:\n- Hover reveals: company-secure-login.com\n- Should be: company.com/password-reset\n- Verdict: ❌ Phishing domain\n\n**3. Timing Analysis**:\n- 10:47 PM is unusual for corporate IT\n- Monday night suggests overseas attacker timezone\n- Verdict: ⚠️ Suspicious\n\n**4. Content Analysis**:\n- Generic greeting (mass phishing)\n- Urgency tactics (24 hours)\n- Threat of consequences (suspension)\n- No specific IT contact information\n- Verdict: ❌ Classic phishing patterns\n\n**Correct Response**:\n1. Don't click any links\n2. Report to real IT security\n3. Forward original email as attachment\n4. Delete from inbox\n5. If clicked, report immediately and change password via official portal"
      },
      {
        id: 2,
        title: "Business Email Compromise",
        scenario: "You work in Finance. This email appears in your inbox:\n\nFrom: David Mitchell, CEO <d.mitchell@company.com>\nSubject: Urgent Wire Transfer - Confidential\n\n\"Hi,\n\nI'm currently in a meeting with our new acquisition partner and need you to process an urgent wire transfer. This is time-sensitive and confidential - please don't discuss with others.\n\nTransfer $47,500 to:\nBank: First National Bank\nAccount: 8847293710\nRouting: 021000089\nBeneficiary: Strategic Consulting LLC\n\nConfirm once complete. I'll explain everything after my meeting.\n\nThanks,\nDavid\n\nSent from my iPhone\"\n\nThe email appears to come from your CEO's actual email address.",
        task: "This could be a legitimate email or a BEC attack. What verification steps should you take before processing?",
        hint: "BEC attacks often involve urgency, secrecy, and requests that bypass normal procedures.",
        solution: "1. Call the CEO directly using a known phone number (not one from the email)\n2. Check with the CEO's assistant\n3. Verify through your company's normal approval process\n4. Note the pressure for secrecy is a red flag\n5. Check email headers for signs of spoofing\n6. The 'Sent from my iPhone' signature can be added to any email",
        explanation: "**Business Email Compromise (BEC) Analysis**:\n\n**Red Flags Present**:\n- Unusual request bypassing normal procedures\n- Urgency pressure (\"time-sensitive\")\n- Secrecy request (\"confidential - don't discuss\")\n- New/unknown recipient (\"Strategic Consulting LLC\")\n- Lack of typical context or reference numbers\n- Request via email for something requiring voice confirmation\n\n**Why This Attack Works**:\n- Appears to come from legitimate executive email\n- Exploits respect for authority\n- Secrecy prevents verification\n- Urgency prevents careful analysis\n- \"Sent from iPhone\" excuses brevity\n\n**Verification Protocol**:\n```\n1. STOP - Do not process immediately\n2. VERIFY - Call known phone number (not email)\n3. CONFIRM - In person or video if possible\n4. DOCUMENT - Follow approval workflows\n5. REPORT - Alert security of the attempt\n```\n\n**Company Defenses**:\n- Dual approval for wire transfers\n- Verification calls mandatory over threshold\n- Pre-approved vendor list\n- Employee training on BEC tactics\n- Email authentication (DMARC)"
      },
      {
        id: 3,
        title: "Smishing (SMS Phishing) Analysis",
        scenario: "You receive this text message:\n\n\"ALERT: Your Bank of America account has been temporarily locked due to suspicious activity. To restore access, verify your identity here: boa-secure.info/verify\n\nReply STOP to stop alerts\"\n\nYou do have a Bank of America account.",
        task: "Analyze this SMS for phishing indicators and explain why mobile phishing is particularly dangerous.",
        hint: "Consider the limitations of viewing URLs on mobile devices and the urgency factor.",
        solution: "Phishing indicators:\n1. Domain boa-secure.info is not bankofamerica.com\n2. Banks don't ask for verification via text links\n3. Urgency tactic (account locked)\n4. Generic message (doesn't use your name)\n5. Reply STOP appears legitimate but builds false credibility\n\nMobile dangers: Small screens make URL verification harder, users are often distracted, and there's a tendency to act quickly on mobile.",
        explanation: "**Smishing Analysis**:\n\n**Domain Red Flag**:\n- Legitimate: bankofamerica.com\n- Phishing: boa-secure.info\n- The .info TLD and creative domain are giveaways\n\n**Why Mobile Phishing is Dangerous**:\n\n1. **Screen Limitations**:\n   - URLs truncated on small screens\n   - Can't hover to preview links\n   - Less visible security indicators\n\n2. **Context**:\n   - Users often distracted when mobile\n   - Checking during commute, etc.\n   - Less careful analysis\n\n3. **Perceived Trust**:\n   - SMS feels more personal/secure\n   - \"They have my phone number\"\n   - Less spam filtering than email\n\n4. **Immediate Action**:\n   - Mobile encourages quick responses\n   - One tap to call or visit links\n   - Less friction to fall victim\n\n**Safe Response**:\n1. Don't click the link\n2. Open Bank of America app directly\n3. Or type bankofamerica.com in browser\n4. Call number on back of your card\n5. Report SMS to 7726 (SPAM)\n6. Delete the message"
      },
      {
        id: 4,
        title: "Vishing (Voice Phishing) Attack",
        scenario: "You receive a call:\n\n'Hi, this is Tyler from PayPal Security. We've detected suspicious activity on your account. For your protection, we need you to verify your account information. Can you please confirm your password and the last 4 digits of your credit card on file?'\n\nCaller ID shows: +1-408-555-0147 (appears legitimate)\nCaller knows: Your first name, rough account activity, that you have a PayPal",
        task: "Explain why this is a phishing attempt and what are the red flags.",
        hint: "PayPal and legitimate companies have specific policies about account security.",
        solution: "Red flags:\n1. Legitimate companies NEVER ask for passwords over phone\n2. Caller ID can be spoofed (showing legitimate PayPal number)\n3. Using personal information to build credibility\n4. Creating urgency ('suspicious activity')\n5. Requesting sensitive information (password, card details)\n6. No method for you to verify caller identity\n7. Asking for info you can't hang up to verify",
        explanation: "**Vishing (Voice Phishing) Attack**:\n\n**Social Engineering Tactics Used**:\n1. **Authority**: Claims to be PayPal Security\n2. **Urgency**: Suspicious activity found\n3. **Legitimacy**: Knows personal info about you\n4. **Trust Building**: References real systems and procedures\n\n**Why It Works**:\n- Voice adds human credibility\n- Harder to verify caller identity\n- Real-time pressure to respond\n- Personal information creates false trust\n- Caller ID spoofing appears legitimate\n\n**What Legitimate Companies Do**:\n```\n✓ Ask you to hang up and call official number\n✓ Never request passwords or full card numbers\n✓ Direct you to account security settings\n✓ Only discuss account actions you initiated\n✓ Have verifiable support tickets\n```\n\n**What Scammers Do**:\n```\n✗ Keep you on the line\n✗ Request sensitive information\n✗ Create artificial urgency\n✗ Threaten account suspension\n✗ Prevent you from verifying\n```\n\n**Proper Response**:\n1. Say: \"I'll call the official number from my statement\"\n2. Hang up immediately\n3. Call the official customer service number\n4. Verify if there was any activity\n5. Report the attempt\n6. Change password anyway"
      },
      {
        id: 5,
        title: "Spear Phishing Attack Analysis",
        scenario: "You receive this email at work:\n\nFrom: Sarah Chen <sarah.chen@company.com>\n(Works in HR, you know her from meetings)\n\nSubject: Check out this article - Our new wellness program\n\n\"Hi everyone,\n\nI've been working with our wellness partner on a new program. The link below shows our new benefits:\n\nhttps://company-wellness-portal.azurewebsites.net/benefits/enroll\n\nPlease review and let me know if you have questions!\n\nThanks,\nSarah\n\nP.S. - I'll send login details separately.\"",
        task: "This email is a spear phishing attack. Identify how attackers impersonated Sarah and what data is at risk.",
        hint: "Spear phishing uses research to make attacks more convincing.",
        solution: "Attack breakdown:\n1. Attacker researched company publicly\n2. Found Sarah Chen is real HR person\n3. Researched new wellness initiatives\n4. Spoofed her email address\n5. Created legitimate-looking domain (azurewebsites.net is a real Azure service - typosquatting)\n6. Sent to 'everyone' assuming employees knowledge of Sarah\n7. When users click, fake login portal steals credentials\n\nData at risk: Work credentials, which could lead to network access, email compromise, or data theft",
        explanation: "**Spear Phishing Sophistication**:\n\n**Research Phase**:\n- LinkedIn finding Sarah as HR\n- Company news finding wellness program\n- Domain research finding Azure services\n- Email lists from job postings\n\n**Impersonation Phase**:\n```\nVulnerable: sarah.chen@company.com (spoofable)\nCould be: sarah.chen@company.com.attacker.com\nCould be: sarah.chen@company.co (typo domain)\n```\n\n**Social Engineering**:\n- Uses real project (wellness program)\n- References real person (Sarah)\n- Creates urgent reason to click\n- Provides legitimate-looking domain\n- Uses company language and tone\n\n**Fake Portal Attack Flow**:\n```\n1. User clicks link\n2. Lands on fake login page (looks real)\n3. Enters work credentials\n4. \"Error: Please try again\"\n5. Actually: Credentials stolen\n6. Attacker logs into real account\n```\n\n**Detection & Defense**:\n```\n✓ Verify email domain matches\n✓ Check sender's actual email if suspicious  \n✓ Don't click links - log into account directly\n✓ Two-factor authentication prevents account takeover\n✓ Company should sign emails with DMARC\n✓ Employee security training is critical\n```\n\n**Real-World Impact**:\n- September 2017: Uber hacker used spear phishing\n- Attackers compromised admin accounts\n- Led to theft of 57M user records"
      }
    ]
  }
};
