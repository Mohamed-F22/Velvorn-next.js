import CheckoutNavbar from "@/Components/CheckoutNavbar";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckoutNavbar />
      {children}
    </>
  );
}
