import "./globals.css";

export const metadata = {
  title: "SNPA — Le refuge animalier | Chaque patte mérite un foyer",
  description:
    "SNPA, refuge animalier : adoptez un chien, un chat ou un autre animal. Découvrez nos pensionnaires, déposez une demande d'adoption et suivez votre dossier en ligne.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
