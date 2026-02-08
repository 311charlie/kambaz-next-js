import Link from "next/link";
import Image from "next/image";
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Row, Col } from "react-bootstrap";


export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/1234/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/2345/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/node.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS2345 Node JS</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Backend development
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/3456/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/mongo.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3456 MongoDB</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Database management
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/4567/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/html.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS4567 HTML & CSS</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Web fundamentals
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/5678/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/javascript.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 JavaScript</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Programming basics
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/6789/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/typescript.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS6789 TypeScript</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Typed JavaScript
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/7890/home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/nextjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS7890 Next.js</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    React framework
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
