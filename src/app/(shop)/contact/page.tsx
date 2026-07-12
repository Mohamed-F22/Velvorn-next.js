import Footer from "@/Components/Footer";
import { Box, Container, Typography } from "@mui/material";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  return (
    <Box sx={{ mt: "80px" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ mb: 5, textAlign: "center" }}>
          Contact Us
        </Typography>
        <ContactForm />
      </Container>
      <Footer />
    </Box>
  );
}
