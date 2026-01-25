import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">Full Stack software developer</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/2345" className="wd-dashboard-course-link">
            <Image src="/images/node.jpg" width={200} height={150} alt="node" />
            <div>
              <h5>CS2345 Node JS</h5>
              <p className="wd-dashboard-course-title">Backend development</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3456" className="wd-dashboard-course-link">
            <Image src="/images/mongo.jpg" width={200} height={150} alt="mongo" />
            <div>
              <h5>CS3456 MongoDB</h5>
              <p className="wd-dashboard-course-title">Database management</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4567" className="wd-dashboard-course-link">
            <Image src="/images/html.jpg" width={200} height={150} alt="html" />
            <div>
              <h5>CS4567 HTML & CSS</h5>
              <p className="wd-dashboard-course-title">Web fundamentals</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/javascript.jpg" width={200} height={150} alt="javascript" />
            <div>
              <h5>CS5678 JavaScript</h5>
              <p className="wd-dashboard-course-title">Programming basics</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/typescript.jpg" width={200} height={150} alt="typescript" />
            <div>
              <h5>CS6789 TypeScript</h5>
              <p className="wd-dashboard-course-title">Typed JavaScript</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/7890" className="wd-dashboard-course-link">
            <Image src="/images/nextjs.jpg" width={200} height={150} alt="nextjs" />
            <div>
              <h5>CS7890 Next.js</h5>
              <p className="wd-dashboard-course-title">React framework</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}