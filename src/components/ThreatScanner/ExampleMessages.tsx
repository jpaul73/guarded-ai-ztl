import { MessageSquare } from "lucide-react";

interface ExampleMessagesProps {
  onSelect: (message: string) => void;
}

const examples = [
  {
    label: "Prize Scam",
    message: "CONGRATULATIONS! You've been selected as the winner of our $1,000,000 lottery! Click here to claim your prize: bit.ly/claim-now. Act immediately - this offer expires in 24 hours!"
  },
  {
    label: "Account Phishing",
    message: "URGENT: Your account has been suspended due to suspicious activity. Please verify your identity immediately by clicking the link below and entering your password. Failure to respond within 24 hours will result in permanent account termination."
  },
  {
    label: "Financial Scam",
    message: "Dear Friend, I am Prince Adeyemi from Nigeria. I have $15,000,000 in a bank account that I need to transfer urgently. I will give you 30% if you help me. Please send your bank account details and wire transfer $500 processing fee via Western Union."
  },
  {
    label: "Safe Message",
    message: "Hi! Just wanted to remind you about our study group meeting tomorrow at 3 PM in the library. Let me know if you can make it. See you there!"
  }
];

const ExampleMessages = ({ onSelect }: ExampleMessagesProps) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Try an example:
      </p>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => onSelect(example.message)}
            className="px-3 py-1.5 text-sm bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground rounded-full border border-border/50 transition-colors"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleMessages;
