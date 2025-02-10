import ResetPasswordForm from "@/components/ResetPasswordForm";

const page = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h3 className="mb-2 text-2xl font-semibold">Reset your Password</h3>
      <ResetPasswordForm />
    </div>
  );
};

export default page;
