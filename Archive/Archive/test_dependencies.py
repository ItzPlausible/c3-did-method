"""Test script to verify MCP Docker server dependencies"""
import sys

print("Testing Python version...")
print(f"Python: {sys.version}")
print()

print("Testing required imports...")

try:
    import mcp
    print(f"✓ mcp installed (version: {mcp.__version__ if hasattr(mcp, '__version__') else 'unknown'})")
except ImportError as e:
    print(f"✗ mcp NOT installed: {e}")
    sys.exit(1)

try:
    import mcp.types as types
    print("✓ mcp.types available")
except ImportError as e:
    print(f"✗ mcp.types NOT available: {e}")
    sys.exit(1)

try:
    from mcp.server import Server
    print("✓ mcp.server.Server available")
except ImportError as e:
    print(f"✗ mcp.server.Server NOT available: {e}")
    sys.exit(1)

try:
    from mcp.server.models import InitializationOptions
    print("✓ mcp.server.models.InitializationOptions available")
except ImportError as e:
    print(f"✗ mcp.server.models.InitializationOptions NOT available: {e}")
    sys.exit(1)

try:
    import mcp.server.stdio
    print("✓ mcp.server.stdio available")
except ImportError as e:
    print(f"✗ mcp.server.stdio NOT available: {e}")
    sys.exit(1)

try:
    import docker
    print(f"✓ docker installed (version: {docker.__version__})")
except ImportError as e:
    print(f"✗ docker NOT installed: {e}")
    print("\nTo install: pip install docker")
    sys.exit(1)

try:
    import pydantic
    print(f"✓ pydantic installed (version: {pydantic.__version__ if hasattr(pydantic, '__version__') else 'unknown'})")
except ImportError as e:
    print(f"✗ pydantic NOT installed: {e}")
    print("\nTo install: pip install pydantic")
    sys.exit(1)

print("\n" + "="*50)
print("All dependencies are installed correctly!")
print("="*50)

print("\nTesting Docker connection...")
try:
    client = docker.from_env()
    info = client.info()
    print(f"✓ Docker is running!")
    print(f"  Docker version: {client.version()['Version']}")
    print(f"  Containers: {info.get('Containers', 0)}")
    print(f"  Images: {info.get('Images', 0)}")
except Exception as e:
    print(f"✗ Cannot connect to Docker: {e}")
    print("  Make sure Docker Desktop is running!")
    
print("\n" + "="*50)
print("Dependency check complete!")
print("="*50)
