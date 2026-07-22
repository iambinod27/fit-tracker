export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="max-w-5xl mx-auto px-8 py-4">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Binod Waiba Tamang. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
