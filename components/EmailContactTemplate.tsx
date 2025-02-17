interface EmailTemplateProps {
  name: string;
  email: string;
  title: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  title,
  message,
}) => (
  <div>
    <h1>New Contact Form Submission</h1>
    <p>Name: {name}</p>
    <p>Email: {email}</p>
    <p>Title: {title}</p>
    <p>Message: {message}</p>
  </div>
);
