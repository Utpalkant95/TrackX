const UiLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      {children}
    </main>
  );
};

export default UiLayout;
