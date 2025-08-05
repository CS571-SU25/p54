import { Container, Card } from "react-bootstrap";

export default function AboutUs() {
    return (
        <div style={{ backgroundColor: "#2125299c", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "2rem" }}>
            <Container className="d-flex justify-content-center align-items-center">
                <Card style={{ maxWidth: "800px", width: "100%", padding: "2rem", borderRadius: "12px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                    <h1 className="text-center mb-4">About Us</h1>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                        <strong>Classifyt</strong> is a platform designed to help individuals better understand their body composition, physical fitness, and training needs. 
                        Our mission is to provide personalized fitness insights and generate customized workout plans based on real data—like your BMI, your current capabilities in the gym, and most importantly, your personal goals.
                    </p>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                        Whether you're just starting out, aiming to lose weight, build muscle, or train like an athlete, Classifyt gives you tailored feedback and a clear path forward. 
                        We combine smart algorithms with intuitive design to help you track progress, set realistic goals, and take the guesswork out of fitness planning.
                    </p>
                    <p className="text-center mt-4" style={{ fontWeight: "500", fontSize: "1.1rem" }}>
                        Built by student, for students—and anyone who wants to train smarter.
                    </p>
                </Card>
            </Container>
        </div>
    );
}
