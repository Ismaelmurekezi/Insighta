import { Button } from "@/components/ui/button";


export default function GoogleLoginButton() {
  return (
    <Button
      variant="outline"
      className="w-full p-4 h-12 max-w-md flex text-md items-center justify-center gap-6 rounded-xl"
    >
      <img src="/google.svg" alt="Google" className="w-7 h-7" />
      Continue with Google
    </Button>
  );
}
