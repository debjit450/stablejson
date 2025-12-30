# Security Policy

## Supported Versions

We actively support the following versions of StableJSON with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of StableJSON seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@stablejson.com**

Include the following information in your report:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Initial Assessment**: We will provide an initial assessment within 5 business days.
- **Regular Updates**: We will keep you informed of our progress throughout the process.
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days.

### Responsible Disclosure

We kindly ask that you:
- Give us reasonable time to investigate and fix the issue before public disclosure
- Avoid accessing, modifying, or deleting data that doesn't belong to you
- Don't perform actions that could harm the reliability or integrity of our services
- Don't use social engineering, physical, or electronic attacks against our employees, users, or infrastructure

### Recognition

We believe in recognizing security researchers who help keep our users safe. With your permission, we will:
- Publicly acknowledge your responsible disclosure
- Include your name in our security acknowledgments (unless you prefer to remain anonymous)

## Security Measures

### Client-Side Security
StableJSON is designed with security in mind:

- **No Server Communication**: All processing happens locally in your browser
- **No Data Storage**: We don't store or transmit any of your JSON data
- **Content Security Policy**: Implemented to prevent XSS attacks
- **Dependency Management**: Regular updates and security audits of dependencies

### Browser Security
- **HTTPS Only**: All web traffic is encrypted
- **Secure Headers**: Proper security headers are implemented
- **No External Resources**: Minimal external dependencies reduce attack surface

### Development Security
- **Code Review**: All code changes are reviewed before merging
- **Automated Scanning**: Dependencies are automatically scanned for vulnerabilities
- **Secure Development**: Following secure coding practices

## Security Best Practices for Users

### General Usage
- **Keep Browser Updated**: Use the latest version of your web browser
- **Trusted Networks**: Use StableJSON on trusted networks when possible
- **Sensitive Data**: Be cautious when processing highly sensitive JSON data

### Data Privacy
- **Local Processing**: Remember that all processing happens locally
- **Browser Storage**: Clear browser storage if using on shared computers
- **No Persistence**: Use incognito/private mode for extra privacy

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledgment sent to reporter
3. **Day 3-7**: Initial assessment and triage
4. **Day 8-30**: Investigation and fix development
5. **Day 31**: Public disclosure (if resolved) or status update

## Contact Information

- **Security Email**: security@stablejson.com
- **General Contact**: hello@stablejson.com
- **GitHub Issues**: For non-security related issues only

## Legal

This security policy is subject to our [Terms of Service](https://stablejson.com/terms) and [Privacy Policy](https://stablejson.com/privacy).

---

Thank you for helping keep StableJSON and our users safe!