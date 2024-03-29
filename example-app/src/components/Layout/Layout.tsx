import { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

interface ILayoutProps {
  children: ReactNode;
}

export default function Layout(props: ILayoutProps): ReactElement {
  const { children } = props;
  return (
    <div className="layout">
      <nav>
        <ul className="layout__list">
          <li>
            <Link className="layout__link" to="/">
              Hook Simple
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-double">
              Hook Double
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-dynamic">
              Hook Dynamic
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-fields">
              Hook Fields
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-lib">
              Hook Lib
            </Link>
          </li>
        </ul>
        <ul className="layout__list">
          <li>
            <Link className="layout__link" to="/component-simple">
              Component Simple
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-double">
              Component Double
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-dynamic">
              Component Dynamic
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-fields">
              Component Fields
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-lib">
              Component Lib
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}
