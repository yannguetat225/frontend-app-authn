// VivaLearn Campus — sign-in and sign-up in the « Pas à pas » layout (variant B chosen by Yann on 03/10/2026,
// ~/vivalearn/design/openedx-auth/). One column on the cream ground, one action at a time, a discreet header and a
// light footer. The French texts are those of the mock-up: the Campus is in French only.
import React, {
  createContext, useContext, useEffect, useRef,
} from 'react';

import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { updatePathWithQueryParams } from '../data/utils';

const SITE_URL = 'https://vivalearn.net/';

export const AuthLayout = ({ children }) => (
  <div className="vl-auth">
    <header className="vl-auth-head">
      <a className="vl-auth-brand" href={SITE_URL}>
        <img src={getConfig().LOGO_URL} width="115" height="49" alt="VivaLearn" />
        <span>Campus</span>
      </a>
      <a className="vl-auth-home" href={SITE_URL}>Retour au site <span aria-hidden="true">↗</span></a>
    </header>
    <main className="vl-auth-stage">
      <div className="vl-auth-col">{children}</div>
    </main>
    <footer className="vl-auth-foot">
      <span>Vivalearn · Création &amp; édition pédagogique</span>
      <nav aria-label="Informations">
        <a href={`${getConfig().LMS_BASE_URL}/help`}>Besoin d’aide</a>
        <a href={`${SITE_URL}privacy.html`}>Confidentialité</a>
        <a href={`${SITE_URL}tos.html`}>Conditions</a>
      </nav>
    </footer>
  </div>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export const StepTop = ({ step, total }) => (
  <div className="vl-auth-top">
    <span className="vl-auth-eyebrow">Votre espace apprenant</span>
    {total ? <span className="vl-auth-count">{`0${step} / 0${total}`}</span> : null}
  </div>
);

StepTop.propTypes = {
  step: PropTypes.number,
  total: PropTypes.number,
};

StepTop.defaultProps = {
  step: 1,
  total: 0,
};

// The heading takes the focus when the step changes, so that the change is announced and Tab starts from the top.
export const Heading = ({ title, intro, focusKey }) => {
  const heading = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (heading.current) {
      heading.current.focus();
    }
  }, [focusKey]);
  return (
    <>
      <h1 className="vl-auth-title" tabIndex="-1" ref={heading}>{title}</h1>
      <p className="vl-auth-intro">{intro}</p>
    </>
  );
};

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  focusKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Heading.defaultProps = {
  focusKey: 1,
};

export const BackButton = ({ onClick }) => (
  <button type="button" className="vl-auth-back" onClick={onClick}>
    <span aria-hidden="true">←</span> Retour
  </button>
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

// Reminds the identifier typed at step 1 and lets the learner change it. The read-only field keeps it in the form for
// password managers, which expect an identifier next to the password.
export const Identity = ({ label, value, onEdit }) => (
  <div className="vl-auth-who">
    <p>{label} <strong>{value}</strong></p>
    <button type="button" className="vl-auth-link" onClick={onEdit}>Modifier</button>
    <input className="sr-only" type="text" autoComplete="username" value={value} readOnly tabIndex="-1" aria-hidden="true" />
  </div>
);

Identity.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

// Logistration provides its tab handler (form backup, provider error cleared, tracking event), so that the links
// between sign-in and sign-up behave like the upstream tabs they replace. Outside Logistration they are plain links.
export const SwitchContext = createContext(null);

export const SwitchLink = ({ to, children }) => {
  const onSwitch = useContext(SwitchContext);
  const handleClick = (event) => {
    if (onSwitch) {
      event.preventDefault();
      onSwitch(to);
    }
  };
  return <Link to={updatePathWithQueryParams(to)} onClick={handleClick}>{children}</Link>;
};

SwitchLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const Divider = () => <div className="vl-auth-divider">ou continuer avec</div>;

export const Legal = () => (
  <p className="vl-auth-legal">
    En demandant un accès, vous acceptez les <a href={`${SITE_URL}tos.html`}>conditions d’utilisation</a> et prenez
    connaissance de la <a href={`${SITE_URL}privacy.html`}>politique de confidentialité</a>
  </p>
);
